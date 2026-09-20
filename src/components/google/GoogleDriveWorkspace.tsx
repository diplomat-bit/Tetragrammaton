import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderOpen, FolderPlus, UploadCloud, FileText, FileSpreadsheet,
  Presentation, FileCode, Search, Grid, List, Trash2, Download,
  Eye, Star, MoreVertical, HardDrive, Sparkles, Plus, Share2, Check,
  ExternalLink, RefreshCw, CheckCircle2, AlertCircle, FileVideo, FileImage
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface DriveFile {
  id: string;
  name: string;
  type: 'doc' | 'sheet' | 'slide' | 'video' | 'image' | 'code' | 'pdf' | 'folder';
  size: string;
  updatedAt: string;
  owner: string;
  starred: boolean;
  webViewLink?: string;
  webContentLink?: string;
  contentPreview?: string;
}

export const GoogleDriveWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'docs' | 'sheets' | 'slides' | 'videos' | 'code'>('all');
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [files, setFiles] = useState<DriveFile[]>([
    {
      id: 'f-1',
      name: 'Class A Fedwire Disbursement Schedule.sheet',
      type: 'sheet',
      size: '2.4 MB',
      updatedAt: 'Today, 10:45 AM',
      owner: 'Citibank Escrow Desk',
      starred: true,
      contentPreview: 'Fedwire IMAD: 20260912CITIUS33990021\nTranches: ADMIN-01 ($1M), SBA-KL-02 ($1M)'
    },
    {
      id: 'f-2',
      name: 'Sovereign Protocol Architecture Whitepaper.doc',
      type: 'doc',
      size: '4.8 MB',
      updatedAt: 'Yesterday',
      owner: 'Aquarius Core',
      starred: true,
      contentPreview: 'Comprehensive whitepaper specifying Merton Risk, Black-Scholes, and Groth16 ZKP.'
    },
    {
      id: 'f-3',
      name: 'Executive Keynote Deck 2026.slide',
      type: 'slide',
      size: '12.1 MB',
      updatedAt: 'Sep 11, 2026',
      owner: 'Treasury Admin',
      starred: false,
      contentPreview: '4-Slide Keynote Presentation on Tier-2 $5.6T Valuation Moats.'
    },
    {
      id: 'f-4',
      name: 'Underwriting_Briefing_Video.webm',
      type: 'video',
      size: '34.5 MB',
      updatedAt: 'Sep 10, 2026',
      owner: 'You',
      starred: true,
      contentPreview: 'Recorded executive briefing on Fedwire priority settlement.'
    },
    {
      id: 'f-5',
      name: 'CollateralizedLoan_ERC3643.sol',
      type: 'code',
      size: '18 KB',
      updatedAt: 'Sep 10, 2026',
      owner: 'Solidity Compiler',
      starred: false,
      contentPreview: 'pragma solidity ^0.8.20;\ncontract CollateralizedLoan is ERC3643 { ... }'
    }
  ]);

  // Fetch real user files from Google Drive API
  const fetchLiveDriveFiles = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await callGoogleApi<{ files?: any[] }>(
        'https://www.googleapis.com/drive/v3/files?pageSize=50&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,iconLink,thumbnailLink)'
      );

      if (res.files && res.files.length > 0) {
        const liveFiles: DriveFile[] = res.files.map((f: any) => {
          let type: DriveFile['type'] = 'doc';
          if (f.mimeType?.includes('spreadsheet')) type = 'sheet';
          else if (f.mimeType?.includes('presentation')) type = 'slide';
          else if (f.mimeType?.includes('video')) type = 'video';
          else if (f.mimeType?.includes('image')) type = 'image';
          else if (f.mimeType?.includes('folder')) type = 'folder';
          else if (f.mimeType?.includes('pdf')) type = 'pdf';
          else if (f.mimeType?.includes('json') || f.mimeType?.includes('xml') || f.mimeType?.includes('javascript')) type = 'code';

          const sizeBytes = f.size ? parseInt(f.size) : 0;
          const sizeStr = sizeBytes > 1024 * 1024 ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(sizeBytes / 1024)} KB`;

          return {
            id: f.id,
            name: f.name || 'Untitled File',
            type,
            size: sizeStr === '0 KB' ? 'Cloud File' : sizeStr,
            updatedAt: f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString() : 'Recent',
            owner: 'My Google Drive',
            starred: false,
            webViewLink: f.webViewLink,
            webContentLink: f.webContentLink,
            contentPreview: `Live Google Drive File (MIME: ${f.mimeType})`
          };
        });

        setFiles((prev) => {
          const ids = new Set(liveFiles.map((lf) => lf.id));
          return [...liveFiles, ...prev.filter((pf) => !ids.has(pf.id))];
        });
        setStatusMsg(`Synchronized ${res.files.length} real files from your Google Drive account!`);
      }
    } catch (err: any) {
      console.warn('Google Drive API fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLiveDriveFiles();
    }
  }, [token, fetchLiveDriveFiles]);

  const handleCreateNewFile = async (type: 'doc' | 'sheet' | 'slide') => {
    const title = prompt(`Enter name for new Google ${type.toUpperCase()}:`, `New Sovereign ${type.toUpperCase()}`);
    if (!title) return;

    if (token) {
      setIsSyncing(true);
      try {
        let mimeType = 'application/vnd.google-apps.document';
        if (type === 'sheet') mimeType = 'application/vnd.google-apps.spreadsheet';
        if (type === 'slide') mimeType = 'application/vnd.google-apps.presentation';

        const res = await callGoogleApi<any>('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          body: JSON.stringify({
            name: title,
            mimeType
          })
        });

        if (res.id) {
          const newF: DriveFile = {
            id: res.id,
            name: title,
            type,
            size: 'Cloud Doc',
            updatedAt: 'Just now',
            owner: 'You',
            starred: true,
            webViewLink: `https://docs.google.com/${type === 'doc' ? 'document' : type === 'sheet' ? 'spreadsheets' : 'presentation'}/d/${res.id}/edit`
          };
          setFiles([newF, ...files]);
          setStatusMsg(`Created "${title}" directly in your Google Drive!`);
        }
      } catch (err: any) {
        setStatusMsg(`Drive creation notice: ${err.message}`);
      } finally {
        setIsSyncing(false);
      }
      return;
    }

    const newLocal: DriveFile = {
      id: `f-${Date.now()}`,
      name: `${title}.${type}`,
      type,
      size: '1.2 MB',
      updatedAt: 'Just now',
      owner: 'You',
      starred: false,
      contentPreview: 'Newly initialized sovereign document.'
    };
    setFiles([newLocal, ...files]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const newFiles: DriveFile[] = Array.from(uploadedFiles).map((file, idx) => {
      let type: DriveFile['type'] = 'doc';
      if (file.name.endsWith('.sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) type = 'sheet';
      else if (file.name.endsWith('.slide') || file.name.endsWith('.pptx')) type = 'slide';
      else if (file.name.endsWith('.mp4') || file.name.endsWith('.webm')) type = 'video';
      else if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.webp')) type = 'image';
      else if (file.name.endsWith('.ts') || file.name.endsWith('.sol') || file.name.endsWith('.xml') || file.name.endsWith('.json')) type = 'code';

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

      return {
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        type,
        size: `${sizeMB} MB`,
        updatedAt: 'Just now',
        owner: 'Local Upload',
        starred: false,
        contentPreview: `Uploaded file (${file.type || 'binary/raw'})`
      };
    });

    setFiles([...newFiles, ...files]);
    setStatusMsg(`Uploaded ${uploadedFiles.length} file(s) into Drive workspace.`);
  };

  const filteredFiles = files.filter((f) => {
    const matchesQuery = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'docs' && f.type === 'doc') ||
      (selectedFilter === 'sheets' && f.type === 'sheet') ||
      (selectedFilter === 'slides' && f.type === 'slide') ||
      (selectedFilter === 'videos' && f.type === 'video') ||
      (selectedFilter === 'code' && f.type === 'code');
    return matchesQuery && matchesFilter;
  });

  const getFileIcon = (type: DriveFile['type']) => {
    switch (type) {
      case 'doc': return <FileText className="w-6 h-6 text-blue-400" />;
      case 'sheet': return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
      case 'slide': return <Presentation className="w-6 h-6 text-amber-400" />;
      case 'video': return <FileVideo className="w-6 h-6 text-red-400" />;
      case 'image': return <FileImage className="w-6 h-6 text-purple-400" />;
      case 'code': return <FileCode className="w-6 h-6 text-indigo-400" />;
      default: return <FolderOpen className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div id="google-drive-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Drive"
        scopeDescription="Connect your Google Account to view, download, edit, and organize all your real Google Drive documents, spreadsheets, slides, and videos."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shadow-inner">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Drive Cloud Storage</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                DRIVE V3 API LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live file system viewer, instant document creator, cloud downloader, and media storage
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {token && (
            <button
              onClick={fetchLiveDriveFiles}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Refresh Drive
            </button>
          )}

          {/* New Document Creators */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCreateNewFile('sheet')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
              title="Create New Google Sheet"
            >
              <Plus className="w-3.5 h-3.5" /> Sheet
            </button>
            <button
              onClick={() => handleCreateNewFile('doc')}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
              title="Create New Google Doc"
            >
              <Plus className="w-3.5 h-3.5" /> Doc
            </button>
            <button
              onClick={() => handleCreateNewFile('slide')}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
              title="Create New Google Slide"
            >
              <Plus className="w-3.5 h-3.5" /> Slide
            </button>
          </div>

          <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition-all cursor-pointer">
            <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
            Upload File
            <input type="file" multiple onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {(['all', 'docs', 'sheets', 'slides', 'videos', 'code'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 text-xs capitalize rounded-lg font-semibold transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search all files in Drive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`p-4 bg-slate-950 border rounded-2xl cursor-pointer transition-all space-y-3 relative group ${
                selectedFile?.id === file.id
                  ? 'border-amber-500/80 ring-1 ring-amber-500/50 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  {getFileIcon(file.type)}
                </div>
                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 rounded-lg text-slate-400 transition-colors"
                    title="Open in Google Apps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div>
                <h3 className="font-bold text-xs text-white truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{file.size} • {file.updatedAt}</p>
              </div>

              {file.contentPreview && (
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 font-mono line-clamp-2">
                  {file.contentPreview}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Last Modified</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredFiles.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => setSelectedFile(f)}
                  className="hover:bg-slate-900/50 cursor-pointer"
                >
                  <td className="py-3 px-4 flex items-center gap-2.5 font-semibold text-white">
                    {getFileIcon(f.type)}
                    <span className="truncate max-w-xs">{f.name}</span>
                  </td>
                  <td className="py-3 px-4 uppercase font-mono text-[10px] text-slate-400">{f.type}</td>
                  <td className="py-3 px-4 font-mono">{f.size}</td>
                  <td className="py-3 px-4 text-slate-400">{f.owner}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{f.updatedAt}</td>
                  <td className="py-3 px-4 text-right">
                    {f.webViewLink ? (
                      <a
                        href={f.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded text-[11px] font-bold transition-colors"
                      >
                        Open <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(f);
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected File Inspection Drawer / Modal */}
      {selectedFile && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                {getFileIcon(selectedFile.type)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{selectedFile.name}</h3>
                <p className="text-xs text-slate-400">{selectedFile.size} • Last modified: {selectedFile.updatedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedFile.webViewLink && (
                <a
                  href={selectedFile.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Open in Google Apps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedFile(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {selectedFile.contentPreview || 'Full cloud file contents synced via Google Drive API.'}
          </div>
        </div>
      )}
    </div>
  );
};
