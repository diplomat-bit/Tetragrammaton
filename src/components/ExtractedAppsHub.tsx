import React, { useState, useEffect, useRef } from 'react';
import { FolderGit2, FileText, Code2, Layers, Cpu, CheckCircle2, RefreshCw, Terminal, Search, ExternalLink, Shield, Server, Box, ChevronRight, Upload, UploadCloud } from 'lucide-react';

interface ExtractedApp {
  id: string;
  folderName: string;
  name: string;
  description: string;
  version: string;
  dependenciesCount: number;
  filesCount: number;
  files: string[];
  hasReadme: boolean;
  hasServer: boolean;
}

export function ExtractedAppsHub() {
  const [apps, setApps] = useState<ExtractedApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ExtractedApp | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      if (data.success) {
        setApps(data.apps);
        if (data.apps.length > 0 && (!selectedApp || !data.apps.some((a: any) => a.id === selectedApp.id))) {
          setSelectedApp(data.apps[0]);
          if (data.apps[0].files.length > 0) {
            fetchFileContent(data.apps[0].folderName, data.apps[0].files[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch extracted apps:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (appFolder: string, filePath: string) => {
    setLoadingFile(true);
    setSelectedFile(filePath);
    try {
      const res = await fetch(`/api/app-file?appFolder=${encodeURIComponent(appFolder)}&filePath=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
      } else {
        setFileContent(`// Error loading file: ${data.error}`);
      }
    } catch (err: any) {
      setFileContent(`// Error: ${err.message}`);
    } finally {
      setLoadingFile(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadStatus(`Uploading and unzipping ${files.length} archive(s)...`);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('zips', files[i]);
    }

    try {
      const res = await fetch('/api/apps/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus(`Successfully extracted ${data.results.length} archive(s)!`);
        await fetchApps();
      } else {
        setUploadStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredApps = apps.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.folderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header & Upload Dropzone Banner */}
      <div className="bg-gradient-to-r from-[#161B22] via-[#1a2234] to-[#161B22] rounded-3xl border border-[#30363D] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {apps.length} EXTRACTED REPOSITORIES
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ZERO-CONFIG AUTO-RENDERER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ZIP Archive Auto-Renderer & Repository Inspector
          </h1>
          <p className="text-xs sm:text-sm text-[#8B949E] max-w-2xl">
            Drop any `.zip` app package below. The system automatically extracts, parses package manifests, indexes code trees, and renders the applications instantly with zero manual code changes required.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".zip"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <UploadCloud className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
            <span>{uploading ? 'Processing ZIPs...' : 'Upload & Auto-Render ZIPs'}</span>
          </button>

          <button
            onClick={fetchApps}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-[#21262d] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-white transition-all cursor-pointer shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300 flex items-center space-x-3 shadow-md animate-fadeIn">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#8B949E]" />
        <input
          type="text"
          placeholder="Search extracted repositories by name or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#161B22] border border-[#30363D] rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-[#8B949E] focus:border-blue-500 focus:outline-none shadow-inner"
        />
      </div>

      {/* Main Grid: App List & File Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Apps List (4 cols) */}
        <div className="lg:col-span-4 bg-[#161B22] rounded-2xl border border-[#30363D] p-4 space-y-3 shadow-xl max-h-[750px] overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-[#30363D]">
            <h3 className="text-xs font-bold font-mono text-[#8B949E] uppercase tracking-wider">
              Repositories ({filteredApps.length})
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            {filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    if (app.files.length > 0) {
                      fetchFileContent(app.folderName, app.files[0]);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-950/40 to-[#1e293b] border-blue-500/60 shadow-lg'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-[#8B949E]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="p-2 rounded-lg bg-[#21262d] text-blue-400 border border-[#30363D]">
                        <FolderGit2 className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{app.folderName}</h4>
                        <span className="text-[10px] font-mono text-[#8B949E]">{app.filesCount} files</span>
                      </div>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-1" />}
                  </div>

                  <p className="text-[11px] text-[#8B949E] line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#21262d] text-[#8B949E] border border-[#30363D]">
                      v{app.version}
                    </span>
                    {app.hasReadme && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        README
                      </span>
                    )}
                    {app.hasServer && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        SERVER
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: File Tree & Code Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#161B22] rounded-2xl border border-[#30363D] p-6 space-y-5 shadow-xl flex flex-col">
          {selectedApp ? (
            <>
              {/* App Meta Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#30363D] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">{selectedApp.folderName}</span>
                    <span className="text-[10px] font-mono text-[#8B949E]">({selectedApp.filesCount} total files)</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selectedApp.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs font-mono text-[#8B949E]">
                    Dependencies: <strong className="text-white">{selectedApp.dependenciesCount}</strong>
                  </span>
                </div>
              </div>

              {/* File Explorer & Code Editor Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* File Tree (4 cols) */}
                <div className="md:col-span-4 bg-[#0D1117] rounded-xl border border-[#30363D] p-3 space-y-2 overflow-y-auto max-h-[500px] scrollbar-thin">
                  <h4 className="text-[10px] font-mono font-bold text-[#8B949E] uppercase tracking-wider px-2">
                    Project Files
                  </h4>
                  <div className="space-y-1">
                    {selectedApp.files.map((file) => {
                      const isFileSelected = selectedFile === file;
                      return (
                        <button
                          key={file}
                          onClick={() => fetchFileContent(selectedApp.folderName, file)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate transition-all cursor-pointer flex items-center space-x-2 ${
                            isFileSelected
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-bold'
                              : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{file}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Code Viewer (8 cols) */}
                <div className="md:col-span-8 bg-[#0D1117] rounded-xl border border-[#30363D] flex flex-col overflow-hidden">
                  <div className="bg-[#161B22] px-4 py-2.5 border-b border-[#30363D] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Code2 className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-mono font-bold text-white truncate">
                        {selectedFile || 'Select a file'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8B949E]">UTF-8 • Code Inspector</span>
                  </div>

                  <div className="flex-1 p-4 overflow-auto max-h-[440px] font-mono text-xs text-[#79C0FF] bg-[#0D1117]">
                    {loadingFile ? (
                      <div className="flex items-center justify-center py-20 text-[#8B949E] space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Loading file content...</span>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap">{fileContent}</pre>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center text-[#8B949E] space-y-3">
              <Box className="w-12 h-12 opacity-30 text-blue-400" />
              <p className="text-sm">Upload or select an extracted app repository from the left list to inspect its files.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExtractedAppsHub;
