
import { ProjectCompendium, FileAnalysis } from '../types';

export const exportService = {
  generateHTMLBlueprint(compendium: ProjectCompendium): string {
    const safeStr = (val: any) => {
        if (typeof val === 'string') return val.replace(/\n/g, '<br><br>');
        return JSON.stringify(val);
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${compendium.repoName.toUpperCase()} // THE CANON</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,800;1,400&family=Playfair+Display:ital,wght@0,900;1,900&display=swap" rel="stylesheet">
    <style>
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        body { 
            background: #ffffff; 
            color: #111111; 
            font-family: 'EB Garamond', serif; 
            line-height: 2.3; 
            font-size: 1.55rem; 
            padding: 0;
            margin: 0;
        }
        h1, h2, h3, h4 { font-family: 'Playfair Display', serif; color: #000; font-weight: 900; letter-spacing: -0.06em; text-transform: uppercase; }
        .mla-container { max-width: 860px; margin: 0 auto; padding: 12rem 2.5rem; }
        .divider { border-top: 2px solid #000; padding-top: 8rem; margin-top: 8rem; margin-bottom: 4rem; }
        .artifact-block { 
            background: #fafafa; 
            padding: 6rem; 
            border: 1px solid #eeeeee; 
            margin: 8rem 0; 
            box-shadow: 0 40px 100px -20px rgba(0,0,0,0.05);
            animation: slideUp 1.2s ease-out both;
        }
        .cinematic-frame { width: 100%; height: auto; border-radius: 4px; margin: 5rem 0; filter: contrast(1.05) brightness(0.95); box-shadow: 0 30px 60px rgba(0,0,0,0.3); }
        .label { font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5em; color: #4f46e5; display: block; margin-bottom: 3rem; }
        .grit-quote { font-size: 3.8rem; line-height: 1; font-weight: 900; font-style: italic; color: #000; margin: 7rem 0; letter-spacing: -0.07em; border-left: 12px solid #4f46e5; padding-left: 4rem; }
        @media print {
            .artifact-block { box-shadow: none; border: 1px solid #ddd; page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="mla-container">
        <header class="text-center mb-60">
            <span class="label">Canonical Research Manuscript // Vol. 01</span>
            <h1 class="text-9xl mb-10">${compendium.repoName}</h1>
            <p class="text-3xl text-slate-400 italic font-serif">A Technical History of the Horizon.</p>
        </header>

        <section class="divider">
            <span class="label">Section I: Master Logic</span>
            <div class="text-3xl italic leading-relaxed text-slate-800">
                ${safeStr(compendium.ceoBlogPost)}
            </div>
        </section>

        <section class="divider">
            <span class="label">Section II: Scale Resonance</span>
            <div class="artifact-block">
                ${safeStr(compendium.billionDollarRubric)}
            </div>
        </section>

        <section class="divider">
            <span class="label">Section III: The Artifacts</span>
            
            ${compendium.summaries.map((s, idx) => `
                <div class="artifact-block">
                    <span class="label">Object_Path: ${s.path}</span>
                    <h2 class="text-8xl italic mb-16">${s.name}</h2>
                    
                    ${s.images?.[0] ? `<img src="${s.images[0]}" class="cinematic-frame" alt="Cinematic Visual">` : ''}

                    <div class="space-y-28 mt-24">
                        <div>
                            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-10 underline">Abstract Truth</h3>
                            <p class="text-2xl italic">${safeStr(s.summary)}</p>
                        </div>

                        <div class="grit-quote">
                            "${safeStr(s.ceoMemo)}"
                        </div>

                        <div>
                            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-10 underline">Technical Memoir</h3>
                            <p class="text-xl text-slate-500">${safeStr(s.narrative)}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </section>

        <footer class="divider text-center py-40 opacity-10">
            <p class="text-[10px] uppercase tracking-[2.5em]">Manuscript Terminated // Just Keep Livin'</p>
        </footer>
    </div>
</body>
</html>`;
  },

  download(repoName: string, html: string) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `THE_${repoName.toUpperCase()}_CANON.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
