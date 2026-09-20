import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ProjectPlan, ProjectExpansionPlan, RepositoryEditPlan, ReasoningMemoryStep, ApiKeyItem } from '../types';

// Prioritize requested Gemini 3.7 / 3.6 / 3.5 / 3.1 / 3.0 flash models and multi-key rotations
export const primaryModels = [
    "gemini-3.7-flash-video-understanding-eap",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-pro-preview",
    "gemini-3-pro-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-preview-09-2025",
    "gemini-2.5-flash-lite-preview-09-2025",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001"
];

export const fallbackModels = [
     "gemini-2.0-flash-lite-001",
     "gemini-2.0-flash-lite",
     "gemini-2.0-flash-lite-preview-02-05",
     "gemini-2.0-flash-lite-preview",
     "gemini-exp-1206",
     "gemma-3-1b-it",
     "gemma-3-4b-it",
     "gemma-3-12b-it",
     "gemma-3-27b-it",
     "gemma-3n-e4b-it",
     "gemma-3n-e2b-it"
];

export const modelsToUse = [...primaryModels, ...fallbackModels];

const MAX_CONTEXT_CHARACTERS = 1000000; // Cap to prevent token limit errors, approx 250k tokens.

// Multi-API Key Pool Store with localStorage persistence
const API_KEYS_STORAGE_KEY = 'gemini_api_keys_pool';

const loadApiKeyPoolFromStorage = (): ApiKeyItem[] => {
    try {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem(API_KEYS_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to load API keys pool from storage', e);
    }
    return [];
};

const saveApiKeyPoolToStorage = (pool: ApiKeyItem[]) => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(pool));
        }
    } catch (e) {
        console.warn('Failed to save API keys pool to storage', e);
    }
};

let apiKeyPool: ApiKeyItem[] = loadApiKeyPoolFromStorage();
let currentKeyIndex = 0;

// Mutable variable to store the primary API key provided by the UI or environment
let defaultGeminiApiKey = process.env.API_KEY || '';

export const setGeminiApiKey = (key: string) => {
    defaultGeminiApiKey = key;
    if (key && !apiKeyPool.some(k => k.key === key)) {
        addApiKeyToPool(key, 'Default Key');
    }
};

export const getApiKeyPool = (): ApiKeyItem[] => {
    return [...apiKeyPool];
};

export const setApiKeyPool = (keys: ApiKeyItem[]) => {
    apiKeyPool = [...keys];
    saveApiKeyPoolToStorage(apiKeyPool);
};

export const addApiKeyToPool = (key: string, label: string = 'Account Key') => {
    if (!key) return;
    const existing = apiKeyPool.find(k => k.key === key);
    if (existing) {
        existing.isActive = true;
        existing.label = label || existing.label;
    } else {
        apiKeyPool.push({
            id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            label,
            key,
            isActive: true,
            errorCount: 0
        });
    }
    saveApiKeyPoolToStorage(apiKeyPool);
};

export const removeApiKeyFromPool = (id: string) => {
    apiKeyPool = apiKeyPool.filter(k => k.id !== id);
    saveApiKeyPoolToStorage(apiKeyPool);
};

export const toggleApiKey = (id: string) => {
    const item = apiKeyPool.find(k => k.id === id);
    if (item) {
        item.isActive = !item.isActive;
        saveApiKeyPoolToStorage(apiKeyPool);
    }
};

export const getActiveApiKeyCount = (): number => {
    return apiKeyPool.filter(k => k.isActive && k.key.trim().length > 0).length;
};

export const getActiveApiKeys = (): string[] => {
    const active = apiKeyPool.filter(k => k.isActive && k.key.trim().length > 0).map(k => k.key.trim());
    if (active.length === 0 && defaultGeminiApiKey) {
        return [defaultGeminiApiKey];
    }
    return active;
};

// Round-robin selector across active keys with preferred slot indexing and fallback to defaultGeminiApiKey
export const getEffectiveApiKey = (preferredIndex?: number): string => {
    const activeKeys = apiKeyPool.filter(k => k.isActive && k.key.trim().length > 0);
    if (activeKeys.length === 0) {
        return defaultGeminiApiKey;
    }
    if (typeof preferredIndex === 'number' && preferredIndex >= 0) {
        const idx = preferredIndex % activeKeys.length;
        const selected = activeKeys[idx];
        selected.lastUsed = Date.now();
        return selected.key;
    }
    currentKeyIndex = currentKeyIndex % activeKeys.length;
    const selected = activeKeys[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % activeKeys.length;
    selected.lastUsed = Date.now();
    return selected.key;
};

// Mark key error and advance to next available key
export const recordKeyError = (key: string) => {
    const item = apiKeyPool.find(k => k.key === key);
    if (item) {
        item.errorCount = (item.errorCount || 0) + 1;
        saveApiKeyPoolToStorage(apiKeyPool);
    }
};

export const estimateTokens = (text: string): number => {
    if (!text) return 0;
    // Approximating ~3.8 characters per token for standard code/json
    return Math.max(1, Math.round(text.length / 3.8));
};

function clearMemoryCache() {
    try {
        if (typeof window !== 'undefined' && (window as any).gc) {
            (window as any).gc();
        }
        if (typeof global !== 'undefined' && (global as any).gc) {
            (global as any).gc();
        }
    } catch (e) {}
}

// Helper function to intelligently build file context without exceeding token limits
const prepareFileContext = (
    allFiles: { path: string, content: string }[],
    activeFilePath?: string
): string => {
    let context = '';
    let remainingChars = MAX_CONTEXT_CHARACTERS;
    
    const filesWithHeaders = allFiles.map(f => {
        const header = `--- START OF FILE ${f.path} ---\n`;
        const footer = `\n`;
        const fullContent = header + f.content + footer;
        return { ...f, fullContent, length: fullContent.length };
    });

    const activeFile = activeFilePath ? filesWithHeaders.find(f => f.path === activeFilePath) : null;
    const otherFiles = filesWithHeaders.filter(f => !activeFilePath || f.path !== activeFilePath);

    // Prioritize active file
    if (activeFile && activeFile.length <= remainingChars) {
        context += activeFile.fullContent;
        remainingChars -= activeFile.length;
    }

    // Add other files until limit is reached
    for (const file of otherFiles) {
        if (file.length <= remainingChars) {
            context += file.fullContent;
            remainingChars -= file.length;
        } else {
            // Stop when we can't fit the next full file
            break;
        }
    }
    
    return context;
};

/**
 * Removes markdown code fences from a string.
 * e.g., "```tsx\nconst a = 1;\n```" -> "const a = 1;"
 * @param rawContent The raw string from the AI, which may contain code fences.
 * @returns The cleaned code string.
 */
export const cleanAiCodeResponse = (rawContent: string): string => {
  if (!rawContent) return '';
  let cleaned = rawContent.trim();
  
  // Strip start and end markdown code fences
  cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\s*\n?/, '');
  cleaned = cleaned.replace(/\n?```\s*$/, '');
  
  // Strip any internal spurious markdown code fences left by multi-stage continuation
  cleaned = cleaned.replace(/\n```[a-zA-Z0-9_-]*\s*\n/g, '\n');
  cleaned = cleaned.replace(/\n```\s*\n/g, '\n');

  return cleaned.trim();
};

async function streamAiResponse(
    model: string,
    prompt: string | (string | { type: string; text: string })[],
    onChunk: (chunk: string) => void,
    getFullResponse: () => string,
    enableSearchGrounding: boolean = false,
    onGrounding?: (sources: { title?: string; uri?: string }[]) => void,
    preferredKeyIndex?: number
): Promise<void> {
    const config: any = {
        temperature: 0.1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 65536,
    };

    if (enableSearchGrounding) {
        config.tools = [{ googleSearch: {} }];
    }

    const foundSources: { title?: string; uri?: string }[] = [];
    const maxKeyAttempts = Math.max(1, getActiveApiKeyCount());
    let lastError: any = null;

    for (let keyAttempt = 0; keyAttempt < maxKeyAttempts; keyAttempt++) {
        const slot = typeof preferredKeyIndex === 'number' ? preferredKeyIndex + keyAttempt : undefined;
        const currentKey = getEffectiveApiKey(slot);
        const ai = new GoogleGenAI({ apiKey: currentKey });

        try {
            const responseStream = await ai.models.generateContentStream({
                model: model,
                contents: [{ role: 'user', parts: [{ text: prompt as string }] }],
                config: config,
            });

            for await (const chunk of responseStream) {
                if (chunk.text) {
                    onChunk(chunk.text);
                }

                const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (chunks && Array.isArray(chunks)) {
                    for (const gChunk of chunks) {
                        if (gChunk.web?.uri) {
                            const source = {
                                title: gChunk.web.title || gChunk.web.uri,
                                uri: gChunk.web.uri,
                            };
                            if (!foundSources.some(s => s.uri === source.uri)) {
                                foundSources.push(source);
                                if (onGrounding) {
                                    onGrounding([...foundSources]);
                                }
                            }
                        }
                    }
                }
            }
            return; // Success!
        } catch (err: any) {
            lastError = err;
            const errStr = String(err?.message || err || '');
            if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
                recordKeyError(currentKey);
                console.warn(`API Key rate-limited. Rotating to next key in pool... (Attempt ${keyAttempt + 1}/${maxKeyAttempts})`);
                continue; // Rotate to next key
            }

            if (enableSearchGrounding && config.tools) {
                delete config.tools;
                try {
                    const fallbackStream = await ai.models.generateContentStream({
                        model: model,
                        contents: [{ role: 'user', parts: [{ text: prompt as string }] }],
                        config: config,
                    });
                    for await (const chunk of fallbackStream) {
                        if (chunk.text) {
                            onChunk(chunk.text);
                        }
                    }
                    return;
                } catch (fallbackErr) {
                    lastError = fallbackErr;
                }
            }
            throw err;
        }
    }

    throw lastError || new Error("All API keys in pool failed.");
}

async function getAiJsonResponse<T>(
    model: string,
    prompt: string,
    schema: any
): Promise<T> {
    const maxKeyAttempts = Math.max(1, getActiveApiKeyCount());
    let lastError: any = null;

    for (let keyAttempt = 0; keyAttempt < maxKeyAttempts; keyAttempt++) {
        const currentKey = getEffectiveApiKey();
        const ai = new GoogleGenAI({ apiKey: currentKey });

        try {
            const response = await ai.models.generateContent({
                model,
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                    temperature: 0.0,
                    topP: 0.95,
                    topK: 64,
                },
            });

            if (response.text) {
                return JSON.parse(response.text.trim()) as T;
            }
            throw new Error('AI returned an empty response.');
        } catch (err: any) {
            lastError = err;
            const errStr = String(err?.message || err || '');
            if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
                recordKeyError(currentKey);
                console.warn(`API Key rate-limited in JSON request. Rotating key... (Attempt ${keyAttempt + 1}/${maxKeyAttempts})`);
                continue;
            }
            throw err;
        }
    }

    throw lastError || new Error("All API keys failed for JSON generation.");
}


export const bulkEditFileWithAI = async (
  originalContent: string,
  instruction: string,
  filePath: string,
  onChunk: (chunk: string) => void,
  getFullResponse: () => string,
  model: string,
  onGrounding?: (sources: { title?: string; uri?: string }[]) => void,
): Promise<void> => {
  const lines = originalContent.split('\n');
  const TOTAL_STAGES = 10;
  let accumulatedContent = '';
  const foundSources: { title?: string; uri?: string }[] = [];

  for (let stage = 1; stage <= TOTAL_STAGES; stage++) {
    const accumulatedLines = accumulatedContent ? accumulatedContent.split('\n') : [];
    const tailContext = accumulatedLines.length > 40 
      ? accumulatedLines.slice(-40).join('\n') 
      : accumulatedContent;

    const prompt = `
      You are an elite, world-class AI software architect and senior engineer equipped with real-time web search capabilities.
      You are executing stage ${stage} of ${TOTAL_STAGES} in a 10-stage chained orchestration pipeline to heavily research, edit, and expand the file "${filePath}" (Original: ${lines.length} lines).
      
      **DEEP RESEARCH INSTRUCTION:**
      - Perform deep online research using your search grounding capabilities to investigate the user's high-level instruction: "${instruction}".
      - Research the latest best practices, optimal language features, up-to-date documentation, security recommendations, and production-ready code patterns related to "${filePath}" and "${instruction}".
      - Generate both deep, rich architectural types AND concrete runtime implementations (functions, algorithms, business logic classes, service methods, state handlers).

      **FULL ENTIRE FILE CONTENT WRITTEN SO FAR (Stages 1 through ${stage - 1} Cumulative):**
      ---
      ${accumulatedContent || '[Start of file - no output generated yet]'}
      ---

      **EXACT RESUMPTION POINT (Stage ${stage} must connect immediately after this tail):**
      ---
      ${tailContext || '[Start of file - no output generated yet]'}
      ---

      **ORIGINAL FILE REFERENCE:**
      ---
      ${originalContent}
      ---

      **CRITICAL CHAINING & ZERO-DUPLICATION CONTINUATION RULES:**
      1. You have the ENTIRE file generated so far in the section above. Understand the full system architecture, all types, exports, and functions written across all previous stages.
      2. DO NOT repeat, re-declare, or re-import any code, interfaces, classes, or sections that were already generated in earlier stages.
      3. Start immediately with the NEXT logical section, function implementation, or type definition that continues seamlessly from the tail.
      4. For every interface and specification, provide concrete, production-ready implementation logic (classes, helper functions, domain services, state machines).
      5. Ensure clean, valid TypeScript/React syntax that connects directly to the preceding code.
      6. If this is stage ${TOTAL_STAGES}, close all open blocks cleanly and ensure the file is complete.
      7. Output ONLY raw executable code for this continuation chunk without markdown code fences.
    `;

    let stageChunk = '';
    await streamAiResponse(
        model,
        prompt,
        (partial) => {
            stageChunk += partial;
            onChunk(partial);
        },
        () => stageChunk,
        stage === 1,
        (sources) => {
            for (const s of sources) {
                if (!foundSources.some(fs => fs.uri === s.uri)) {
                    foundSources.push(s);
                    if (onGrounding) {
                        onGrounding([...foundSources]);
                    }
                }
            }
        }
    );

    accumulatedContent += (accumulatedContent ? '\n' : '') + stageChunk;
    clearMemoryCache();
  }
};


export const generateProjectPlan = async (
    prompt: string,
    model: string
): Promise<ProjectPlan> => {
    const promptForAI = `
        You are a 10x software architect. A user wants to create a new project.
        Your task is to analyze their prompt and generate a file structure and a brief description for each file.
        - The user prompt is: "${prompt}"
        - Based on the prompt, create a logical file structure.
        - For each file, provide a concise one-sentence description of its purpose.
        - The output must be a JSON object that adheres to the provided schema.
        - Only include files that would contain code or text. Do not include directories as separate entries.
        - Be comprehensive. Create all the necessary files for a basic, runnable version of the described project.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            files: {
                type: Type.ARRAY,
                description: 'A list of files to be created for the project.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        path: {
                            type: Type.STRING,
                            description: 'The full path of the file, including directories. E.g., "src/components/Button.tsx".'
                        },
                        description: {
                            type: Type.STRING,
                            description: 'A concise, one-sentence description of what this file will contain or its purpose.'
                        }
                    },
                    required: ['path', 'description']
                }
            }
        },
        required: ['files']
    };
    return getAiJsonResponse<ProjectPlan>(model, promptForAI, schema);
};


export const generateFileContent = async (
    projectPrompt: string,
    filePath: string,
    fileDescription: string,
    onChunk: (chunk: string) => void,
    getFullResponse: () => string,
    model: string,
    enableSearchGrounding: boolean = true,
    onGrounding?: (sources: { title?: string; uri?: string }[]) => void
): Promise<void> => {
    const TOTAL_STAGES = 10;
    let accumulatedContent = '';
    const foundSources: { title?: string; uri?: string }[] = [];

    for (let stage = 1; stage <= TOTAL_STAGES; stage++) {
        const accumulatedLines = accumulatedContent ? accumulatedContent.split('\n') : [];
        const tailContext = accumulatedLines.length > 40 
          ? accumulatedLines.slice(-40).join('\n') 
          : accumulatedContent;

        const researchInstructions = `
            **DEEP RESEARCH INSTRUCTION (Stage ${stage} of ${TOTAL_STAGES}):**
            - Perform deep online research using search grounding to investigate the latest enterprise best practices, up-to-date framework documentation, comprehensive type definitions, and robust production implementations for "${filePath}" (${fileDescription}).
            - Ensure extremely high code density, robust architecture, and exhaustive detail with concrete runtime implementations.
        `;

        const prompt = `
            You are an elite, world-class AI software architect and senior engineer building massive, production-grade applications.
            The overall project goal is: "${projectPrompt}"
            You are creating the file at path: "${filePath}"
            The purpose of this file is: "${fileDescription}"
            ${researchInstructions}

            **FULL ENTIRE FILE CONTENT WRITTEN SO FAR (Stages 1 through ${stage - 1} Cumulative):**
            ---
            ${accumulatedContent || '[Start of file - no output generated yet]'}
            ---

            **EXACT RESUMPTION POINT (Stage ${stage} must connect immediately after this tail):**
            ---
            ${tailContext || '[Start of file - no output generated yet]'}
            ---

            **CRITICAL CHAINING & ZERO-DUPLICATION CONTINUATION RULES:**
            1. You have the ENTIRE file generated so far in the section above. Understand the full system architecture, all types, exports, and functions written across all previous stages.
            2. DO NOT repeat, re-declare, or re-import any code, interfaces, classes, or sections that were already generated in earlier stages.
            3. Start immediately with the NEXT logical section, function implementation, or type definition that continues seamlessly from the tail.
            4. For every interface and specification, provide concrete, production-ready implementation logic (classes, helper functions, domain services, state machines).
            5. Ensure clean, valid TypeScript/React syntax that connects directly to the preceding code.
            6. If this is stage ${TOTAL_STAGES}, close all open blocks cleanly and ensure the file is complete.
            7. Output ONLY raw executable code for this continuation chunk without markdown code fences.
        `;

        let stageChunk = '';
        await streamAiResponse(
            model,
            prompt,
            (partial) => {
                stageChunk += partial;
                onChunk(partial);
            },
            () => stageChunk,
            stage === 1 || enableSearchGrounding,
            (sources) => {
                for (const s of sources) {
                    if (!foundSources.some(fs => fs.uri === s.uri)) {
                        foundSources.push(s);
                        if (onGrounding) {
                            onGrounding([...foundSources]);
                        }
                    }
                }
            }
        );

        accumulatedContent += (accumulatedContent ? '\n' : '') + stageChunk;
        clearMemoryCache();
    }
};


export const planProjectExpansionEdits = async (
    fileContents: { path: string, content: string }[],
    prompt: string,
    model: string,
    scale: 'micro' | 'compact' | 'massive' = 'compact'
): Promise<ProjectExpansionPlan> => {
    const fileContext = fileContents.map(f => `--- START OF SEED FILE ${f.path} ---\n${f.content}\n`).join('');
    
    let scaleInstructions = '';
    if (scale === 'micro') {
        scaleInstructions = "Plan an extremely fast, highly targeted expansion. Suggest ONLY 3 to 5 highly essential files containing the absolute minimum core code necessary to introduce the feature. Avoid non-essential utilities or auxiliary layouts.";
    } else if (scale === 'compact') {
        scaleInstructions = "Plan a balanced, clean project expansion. Suggest 6 to 12 files to cover the requested feature neatly, without adding unnecessary or duplicative boilerplate.";
    } else {
        scaleInstructions = "Plan a very comprehensive, massive-scale system expansion. Generate 20+ new files covering full routing, helper types, layouts, utilities, and components to flesh out a massive production structure.";
    }

    const promptForAI = `
        You are a god-tier AI software architect and scale project generator equipped with deep online research capabilities.
        
        **DEEP RESEARCH & ARCHITECTURE INSTRUCTION:**
        - Perform deep online research to investigate up-to-date best practices, architecture patterns, and production-grade libraries for "${prompt}".
        - Use this researched knowledge to plan a robust, state-of-the-art system architecture.

        Your task is to take a single seed file and generate a project expansion around it.
        The user's high-level goal is: "${prompt}"

        You have been given the content of the SEED FILE.
        Based on this seed, you must generate a logical configuration plan to create a series of new files to build out the requested system.
        
        **OBJECTIVES AND SCALE CONSTRAINTS:**
        1. Analyze the seed file to understand the core domain and patterns.
        2. ${scaleInstructions}
        3. 'filesToCreate': A list of NEW files to be generated. For each file, make sure to specify a clear, concise description. Assign an agent index (0-7) to each helper for parallel creation.
        4. 'filesToEdit': **MUST BE EMPTY.** Do not edit the seed file. The seed file is immutable.

        Your response must be a JSON object adhering to the provided schema.

        Here is the SEED FILE context:
        ${fileContext}
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            filesToEdit: {
                type: Type.ARRAY,
                description: 'Must be empty. Do not edit the seed file.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        path: { type: Type.STRING, description: 'Path of the file to edit.' },
                        changes: { type: Type.STRING, description: 'Detailed, step-by-step instructions for the code modifications.' }
                    },
                    required: ['path', 'changes']
                }
            },
            filesToCreate: {
                type: Type.ARRAY,
                description: 'A massive list of new files to create.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        path: { type: Type.STRING, description: 'Full path of the new file to create.' },
                        description: { type: Type.STRING, description: 'Detailed description of the new file\'s purpose and content.' },
                        agentIndex: { type: Type.NUMBER, description: 'Agent index (0-7) assigned to create this file.'}
                    },
                    required: ['path', 'description', 'agentIndex']
                }
            }
        }
    };
    return getAiJsonResponse<ProjectExpansionPlan>(model, promptForAI, schema);
};

export const streamSingleFileEdit = async (
    originalContent: string,
    instruction: string,
    filePath: string,
    onChunk: (chunk: string) => void,
    model: string
): Promise<void> => {
    if (getActiveApiKeyCount() > 1 && originalContent.length > 300) {
        return streamRepositoryFileEdit(originalContent, instruction, filePath, onChunk, model);
    }

    const prompt = `
        You are an AI code assistant. Rewrite the following file content based on the user's instruction.

        **CRITICAL RULE: Your entire response must be ONLY the new, complete file content.**
        - Do NOT output markdown code fences (e.g., \`\`\`).
        - The output will be saved directly to a file, so it must be clean.

        Instruction: "${instruction}"
        File Path: "${filePath}"
        Original Content:
        ---
        ${originalContent}
        ---
    `;
    await streamAiResponse(model, prompt, onChunk, () => '');
};


export const planRepositoryEdit = async (
    instruction: string,
    activeFilePath: string,
    allFiles: { path: string, content: string, sha: string }[],
    model: string,
    reasoningChain?: ReasoningMemoryStep[]
): Promise<RepositoryEditPlan> => {

    const fileContext = prepareFileContext(allFiles, activeFilePath);

    let historicalReasoningSection = '';
    if (reasoningChain && reasoningChain.length > 0) {
        historicalReasoningSection = `
        **PRIOR AGENT REASONING & ATTEMPTS MEMORY (Review carefully to avoid repeat errors):**
        ${reasoningChain.map((step, i) => `
        --- Attempt #${step.attempt} (${step.model} / ${step.agentRole}) ---
        Timestamp: ${step.timestamp}
        Plan Reasoning: ${step.planReasoning}
        Files Planned: ${step.filesPlanned.join(', ')}
        Build Status: ${step.buildStatus}
        ${step.buildLogsExcerpt ? `Build Log Excerpt: ${step.buildLogsExcerpt}` : ''}
        ${step.critique ? `Self-Correction Critique: ${step.critique}` : ''}
        `).join('\n')}
        --- END OF REASONING MEMORY ---
        `;
    }

    const promptForAI = `
        You are an autonomous AI Lead Architect Agent. Your task is to implement a user's request by planning a series of precise file edits.
        
        **CRITICAL DIRECTIVE:**
        You have complete and unrestricted access to the full source code of every file in the repository, provided below. 
        You MUST use this context to inform your plan. Do not, under any circumstances, claim you cannot see a file or that the code is incomplete. Base your entire plan on the provided code.

        **User Request:** "${instruction}"
        (The user was viewing this file when they made the request: "${activeFilePath}")

        ${historicalReasoningSection}

        **Your Task:**
        1.  **Reasoning:** First, in a few sentences, explain your plan. Describe which files you will edit and why, outlining your high-level strategy to fulfill the user request. Incorporate lessons learned from past attempts if any failed.
        2.  **filesToEdit:** Second, create a precise list of files to edit. For each file, provide a detailed, step-by-step description of the exact changes needed. This is not the code itself, but a set of instructions for another AI to execute. Be specific. For example, instead of "update the function," say "in the 'handleSubmit' function, add a new 'if' condition to check for 'user.id' before calling the API."

        Your output must be a single JSON object that strictly follows the provided schema.

        **These are the existing files in the app:**
        ${fileContext}
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            reasoning: {
                type: Type.STRING,
                description: "A high-level explanation of your plan, which files you will edit, and why."
            },
            filesToEdit: {
                type: Type.ARRAY,
                description: 'A list of files to modify and the specific changes for each.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        path: { type: Type.STRING, description: 'Path of the file to edit.' },
                        changes: { type: Type.STRING, description: 'Detailed, step-by-step instructions for the code modifications.' }
                    },
                    required: ['path', 'changes']
                }
            }
        },
        required: ['reasoning', 'filesToEdit']
    };
    return getAiJsonResponse<RepositoryEditPlan>(model, promptForAI, schema);
};


export const applySearchReplacePatches = (original: string, responseText: string): string => {
    let updated = original;
    const regex = /<<<<<<< SEARCH\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>>/g;
    let match;
    let appliedCount = 0;

    while ((match = regex.exec(responseText)) !== null) {
        const searchBlock = match[1].trim();
        const replaceBlock = match[2].trim();
        if (searchBlock && updated.includes(searchBlock)) {
            updated = updated.replace(searchBlock, replaceBlock);
            appliedCount++;
        }
    }

    if (appliedCount === 0 && responseText.length > 200 && responseText.length >= original.length * 0.8) {
        return responseText;
    }

    return updated;
};

export const streamRepositoryFileEdit = async (
    originalContent: string,
    changesInstruction: string,
    filePath: string,
    onChunk: (chunk: string) => void,
    model: string,
    onGrounding?: (sources: { title?: string; uri?: string }[]) => void
): Promise<void> => {
    const numKeys = getActiveApiKeyCount();

    // If multiple API keys are active, split the file into K parallel segments across all keys
    if (numKeys > 1) {
        const numSegments = numKeys;
        const segmentOutputs: string[] = new Array(numSegments).fill('');
        const foundSources: { title?: string; uri?: string }[] = [];

        const segmentPromises = Array.from({ length: numSegments }, async (_, segIdx) => {
            const segNum = segIdx + 1;
            let roleDescription = '';
            if (segIdx === 0) {
                roleDescription = 'Segment 1 of ' + numSegments + ': Top-level module imports, system configurations, schemas, TypeScript types, interfaces, and state stores.';
            } else if (segIdx === numSegments - 1) {
                roleDescription = 'Segment ' + numSegments + ' of ' + numSegments + ': UI component presentation, hook handlers, export declarations, and clean file termination.';
            } else {
                roleDescription = 'Segment ' + segNum + ' of ' + numSegments + ': Core domain services, business logic, asynchronous pipelines, data handlers, and state mutation algorithms (Part ' + segIdx + ').';
            }

            const segmentPrompt = `
                You are Agent #${segNum} in a ${numSegments}-agent parallel swarm executing on dedicated API Key slot #${segNum}.
                Your task is to generate **${roleDescription}** for "${filePath}".

                **USER INSTRUCTION & DEEP RESEARCH CONTEXT:**
                "${changesInstruction}"

                **ORIGINAL FILE CONTEXT (Reference):**
                ---
                ${originalContent}
                ---

                **PARALLEL SEGMENT DIRECTIVES:**
                1. You are generating strictly Segment ${segNum} of ${numSegments}.
                2. Do not duplicate segments belonging to other agents.
                3. Provide clean, robust, production-grade code that connects cleanly with the other segments.
                4. Output ONLY raw executable code for this segment without markdown code fences.
            `;

            await streamAiResponse(
                model,
                segmentPrompt,
                (partial) => {
                    segmentOutputs[segIdx] += partial;
                    const combined = segmentOutputs.filter(Boolean).join('\n\n');
                    onChunk(combined);
                },
                () => segmentOutputs[segIdx],
                segIdx === 0,
                (sources) => {
                    for (const s of sources) {
                        if (!foundSources.some(fs => fs.uri === s.uri)) {
                            foundSources.push(s);
                            if (onGrounding) onGrounding([...foundSources]);
                        }
                    }
                },
                segIdx // Preferred API key slot
            );
        });

        await Promise.all(segmentPromises);
        clearMemoryCache();
        return;
    }

    // Single key fallback: progressive chained stages
    const lines = originalContent.split('\n');
    const TOTAL_STAGES = 10;
    let accumulatedContent = '';
    const foundSources: { title?: string; uri?: string }[] = [];

    for (let stage = 1; stage <= TOTAL_STAGES; stage++) {
        const accumulatedLines = accumulatedContent ? accumulatedContent.split('\n') : [];
        const tailContext = accumulatedLines.length > 40 
          ? accumulatedLines.slice(-40).join('\n') 
          : accumulatedContent;

        const stagePrompt = `
            You are an elite AI software engineer equipped with deep web research and search grounding. You are executing stage ${stage} of ${TOTAL_STAGES} in a 10-stage chained orchestration pipeline to edit/rewrite the file "${filePath}" (Original: ${lines.length} lines).
            
            **INSTRUCTION TO APPLY & DEEP RESEARCH:**
            "${changesInstruction}"
            - Research latest best practices and apply them robustly with concrete runtime implementations.

            **FULL ENTIRE FILE CONTENT WRITTEN SO FAR (Stages 1 through ${stage - 1} Cumulative):**
            ---
            ${accumulatedContent || '[Start of file - no output generated yet]'}
            ---

            **EXACT RESUMPTION POINT (Stage ${stage} must connect immediately after this tail):**
            ---
            ${tailContext || '[Start of file - no output generated yet]'}
            ---

            **ORIGINAL FILE REFERENCE:**
            ---
            ${originalContent}
            ---

            **CRITICAL CHAINING & ZERO-DUPLICATION CONTINUATION RULES:**
            1. You have the ENTIRE file generated so far in the section above. Understand the full system architecture, all types, exports, and functions written across all previous stages.
            2. DO NOT repeat, re-declare, or re-import any code, interfaces, classes, or sections that were already generated in earlier stages.
            3. Start immediately with the NEXT logical section, function implementation, or type definition that continues seamlessly from the tail.
            4. For every interface and specification, provide concrete, production-ready implementation logic (classes, helper functions, domain services, state machines).
            5. Ensure clean, valid TypeScript/React syntax that connects directly to the preceding code.
            6. If this is stage ${TOTAL_STAGES}, close all open blocks cleanly and ensure the file is complete.
            7. Output ONLY raw executable code for this continuation chunk without markdown code fences.
        `;

        let stageChunk = '';
        await streamAiResponse(model, stagePrompt, (partial) => {
            stageChunk += partial;
            onChunk(partial);
        }, () => stageChunk, stage === 1, (sources) => {
            for (const s of sources) {
                if (!foundSources.some(fs => fs.uri === s.uri)) {
                    foundSources.push(s);
                    if (onGrounding) {
                        onGrounding([...foundSources]);
                    }
                }
            }
        });

        accumulatedContent += (accumulatedContent ? '\n' : '') + stageChunk;
        clearMemoryCache();
    }
};

export const correctCodeFromBuildError = async (
    originalInstruction: string,
    allFiles: { path: string, content: string, sha: string }[],
    previousEdits: { path: string, newContent: string }[],
    buildLogs: string,
    model: string,
    reasoningChain?: ReasoningMemoryStep[]
): Promise<RepositoryEditPlan> => {

    const fileContext = prepareFileContext(allFiles);

    const previousEditsContext = previousEdits.map(e => 
        `I previously tried to edit "${e.path}" to have this content:\n---\n${e.newContent}\n---\n`
    ).join('\n');

    let historicalReasoningSection = '';
    if (reasoningChain && reasoningChain.length > 0) {
        historicalReasoningSection = `
        **HISTORICAL REASONING & FAILURE RECOVERY MEMORY:**
        ${reasoningChain.map((step, i) => `
        - Cycle Attempt #${step.attempt} (${step.agentRole} using ${step.model}):
          Planned: ${step.filesPlanned.join(', ')}
          Original Hypothesis: ${step.planReasoning}
          Status: ${step.buildStatus}
          ${step.critique ? `Past Critique: ${step.critique}` : ''}
        `).join('\n')}
        `;
    }

    const promptForAI = `
        You are an autonomous AI Self-Correction Critic & Repair Engineer. Your previous attempt to modify the code resulted in a failed build. Your task is to analyze the build logs, understand the error, and create a NEW plan to fix it.

        **CRITICAL DIRECTIVE:**
        You have complete and unrestricted access to the full source code of every file in the repository, provided below. 
        You MUST use this context. Do not claim you cannot see a file or that the code is truncated. Your fix must be based on the actual code provided.

        **Original User Request:** "${originalInstruction}"

        ${historicalReasoningSection}

        **Build Error Logs:**
        ---
        ${buildLogs}
        ---

        **My Previous (Failed) Edits:**
        ${previousEditsContext}
        
        **Your Corrective Task:**
        1.  **Analyze & Reason:** Read the build logs and my previous edits carefully. In a few sentences, explain the exact root cause of the build failure (syntax error, missing export, type mismatch, unresolved module, etc.) and what past attempt missed. Then, describe your new concrete plan to fix the code.
        2.  **filesToEdit:** Create a new, precise list of files to edit to fix the error. For each file, provide a detailed, step-by-step description of the exact changes needed. This plan will completely replace the previous one. If you need to revert a change in one file and edit another, specify both actions.

        Your output must be a single JSON object that strictly follows the provided schema.

        **These are the current files in the app (reflecting your previous failed attempt):**
        ${fileContext}
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            reasoning: {
                type: Type.STRING,
                description: "An analysis of the build failure root cause and a high-level explanation of your new plan to fix it."
            },
            filesToEdit: {
                type: Type.ARRAY,
                description: 'A new list of files to modify and the specific changes for each to fix the build.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        path: { type: Type.STRING, description: 'Path of the file to edit.' },
                        changes: { type: Type.STRING, description: 'Detailed, step-by-step instructions for the new code modifications.' }
                    },
                    required: ['path', 'changes']
                }
            }
        },
        required: ['reasoning', 'filesToEdit']
    };
    return getAiJsonResponse<RepositoryEditPlan>(model, promptForAI, schema);
};