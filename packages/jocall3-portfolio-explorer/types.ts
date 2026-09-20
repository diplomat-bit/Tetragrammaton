export interface GithubRepo {
  id: number | string;
  name: string;
  full_name?: string;
  description?: string | null;
  html_url?: string;
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  default_branch?: string;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  [key: string]: any;
}

export interface GithubFile {
  name: string;
  path: string;
  sha?: string;
  size: number;
  url?: string;
  html_url?: string;
  git_url?: string;
  download_url?: string | null;
  type: 'file' | 'dir' | 'blob' | string;
  content?: string;
  [key: string]: any;
}

export interface RepoDossier {
  pitch: string;
  techStack: string[];
  keyFeatures: Array<{
    title: string;
    description: string;
  }>;
  architectureSummary: string;
  growthPotential: string;
  [key: string]: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  text: string;
  timestamp?: string;
}

export interface SelectedContext {
  repo: GithubRepo | null;
  file?: GithubFile | null;
  chatHistory: ChatMessage[];
  dossier?: RepoDossier | null;
}

export interface EpicScene {
  id: number | string;
  heading: string;
  content: string;
  image?: string;
  [key: string]: any;
}

export interface EpicScreenplay {
  title: string;
  logline: string;
  worldBuilding?: string;
  scenes: EpicScene[];
  characters?: Array<{ name: string; role: string; bio: string }>;
  acts?: Array<{
    actNumber: number;
    title: string;
    sceneHeading: string;
    narrative: string;
    dialogue?: Array<{ character: string; line: string }>;
  }>;
  rawText?: string;
  [key: string]: any;
}

export interface ProjectCompendium {
  repoName: string;
  overview?: string;
  architecture?: string;
  fileAnalyses?: FileAnalysis[];
  [key: string]: any;
}

export interface FileAnalysis {
  path: string;
  summary?: string;
  criticalFunctions?: string[];
  notes?: string;
  [key: string]: any;
}
