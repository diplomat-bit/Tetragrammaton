import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  HardDrive, Folder, File, FileText, Image, Film, Music, Archive, Code,
  Search, RefreshCw, UploadCloud, FolderPlus, Star, Trash2, ExternalLink,
  Download, Eye, Grid, List, ChevronRight, ArrowLeft, MoreVertical,
  CheckCircle2, AlertCircle, Sparkles, User, Info, LogOut, ShieldCheck,
  FileSpreadsheet, Presentation, FileCode, Clock, Share2, CornerDownRight
} from 'lucide-react';
import { auth, signInWithGooglePopup, logOut, getGoogleWorkspaceToken, setGoogleWorkspaceToken, clearGoogleWorkspaceToken } from '../firebase';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  starred?: boolean;
  owners?: { displayName?: string; emailAddress?: string; photoLink?: string }[];
  shared?: boolean;
  description?: string;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveUser {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export const GoogleDriveBrowser: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [currentUser, setCurrentUser] = useState<DriveUser | null>(null);
  const [storageQuota, setStorageQuota] = useState<DriveStorageQuota | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  
  // Navigation & Directory
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'My Drive' }
  ]);
  
  // File Listing
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'folders' | 'docs' | 'sheets' | 'slides' | 'pdf' | 'media' | 'starred'>('all');
  const [sortBy, setSortBy] = useState<'modified-desc' | 'modified-asc' | 'name-asc' | 'name-desc' | 'size-desc'>('modified-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals & Actions
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Manual token input modal toggle
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-clear toast notices
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Load User & Quota
  const fetchDriveAbout = useCallback(async (authToken: string) => {
    try {
      setIsLoadingUser(true);
      const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) {
        if (res.status === 401) {
          clearGoogleWorkspaceToken();
          setToken(null);
          setErrorMsg('Google OAuth session expired. Please reconnect your Google Account.');
        }
        return;
      }
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
      if (data.storageQuota) setStorageQuota(data.storageQuota);
    } catch (err: any) {
      console.warn('Drive about error:', err);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Fetch Files
  const fetchFiles = useCallback(async (folderId: string, search: string = '', filter: string = 'all') => {
    const currentToken = token || getGoogleWorkspaceToken();
    if (!currentToken) return;

    setIsLoadingFiles(true);
    setErrorMsg(null);

    try {
      // Build Google Drive query string
      let q = 'trashed = false';
      if (search.trim()) {
        const safeSearch = search.trim().replace(/'/g, '');
        q += ` and (name contains '${safeSearch}' or fullText contains '${safeSearch}')`;
      } else {
        q += ` and '${folderId}' in parents`;
      }

      if (filter === 'folders') {
        q += " and mimeType = 'application/vnd.google-apps.folder'";
      } else if (filter === 'docs') {
        q += " and mimeType = 'application/vnd.google-apps.document'";
      } else if (filter === 'sheets') {
        q += " and mimeType = 'application/vnd.google-apps.spreadsheet'";
      } else if (filter === 'slides') {
        q += " and mimeType = 'application/vnd.google-apps.presentation'";
      } else if (filter === 'pdf') {
        q += " and mimeType = 'application/pdf'";
      } else if (filter === 'media') {
        q += " and (mimeType contains 'image/' or mimeType contains 'video/' or mimeType contains 'audio/')";
      } else if (filter === 'starred') {
        q += " and starred = true";
      }

      let orderClause = 'folder, modifiedTime desc';
      if (sortBy === 'modified-asc') orderClause = 'folder, modifiedTime asc';
      if (sortBy === 'name-asc') orderClause = 'folder, name asc';
      if (sortBy === 'name-desc') orderClause = 'folder, name desc';

      const fields = 'nextPageToken, files(id, name, mimeType, modifiedTime, size, webViewLink, webContentLink, iconLink, thumbnailLink, parents, starred, owners, shared, description)';
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&orderBy=${encodeURIComponent(orderClause)}&pageSize=100`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          clearGoogleWorkspaceToken();
          setToken(null);
          throw new Error('Google OAuth token expired or unauthorized. Please re-authenticate.');
        }
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Google Drive API error (${response.status})`);
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error('Fetch files error:', err);
      setErrorMsg(err.message || 'Failed to fetch Google Drive files.');
    } finally {
      setIsLoadingFiles(false);
    }
  }, [token, sortBy]);

  // Initial load
  useEffect(() => {
    const activeTok = getGoogleWorkspaceToken();
    if (activeTok) {
      setToken(activeTok);
      fetchDriveAbout(activeTok);
      fetchFiles(currentFolderId, searchQuery, activeFilter);
    }
  }, [fetchDriveAbout, fetchFiles, currentFolderId, searchQuery, activeFilter]);

  // Google Sign-In with OAuth
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      const { user, accessToken } = await signInWithGooglePopup();
      if (accessToken) {
        setToken(accessToken);
        setGoogleWorkspaceToken(accessToken);
        setSuccessMsg(`Successfully authenticated as ${user.email || 'Google User'}!`);
        fetchDriveAbout(accessToken);
        fetchFiles('root', '', 'all');
      } else {
        throw new Error('Failed to obtain Google Workspace access token. Check permissions.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google. Ensure popups are allowed.');
    }
  };

  const handleDisconnect = () => {
    clearGoogleWorkspaceToken();
    setToken(null);
    setCurrentUser(null);
    setFiles([]);
    setStorageQuota(null);
    setSuccessMsg('Disconnected Google Drive.');
  };

  // Folder navigation
  const openFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setSearchQuery('');
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
  };

  const navigateToBreadcrumb = (index: number) => {
    const target = breadcrumbs[index];
    setBreadcrumbs(prev => prev.slice(0, index + 1));
    setCurrentFolderId(target.id);
    setSearchQuery('');
  };

  const navigateUp = () => {
    if (breadcrumbs.length > 1) {
      navigateToBreadcrumb(breadcrumbs.length - 2);
    }
  };

  // Create Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFolderName.trim()) return;

    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          mimeType: 'application/vnd.google-apps.folder',
          parents: [currentFolderId]
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || 'Failed to create folder');
      }

      setSuccessMsg(`Folder "${newFolderName.trim()}" created successfully!`);
      setNewFolderName('');
      setIsCreateFolderOpen(false);
      fetchFiles(currentFolderId, searchQuery, activeFilter);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating folder');
    }
  };

  // File Upload via Google Drive Multipart API
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0 || !token) return;

    const file = fileList[0];
    setIsUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    setErrorMsg(null);

    try {
      const metadata = {
        name: file.name,
        parents: [currentFolderId]
      };

      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelim = `\r\n--${boundary}--`;

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const contentType = file.type || 'application/octet-stream';
          const base64Data = (reader.result as string).split(',')[1];

          const multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            `Content-Type: ${contentType}\r\n` +
            'Content-Transfer-Encoding: base64\r\n\r\n' +
            base64Data +
            closeDelim;

          const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': `multipart/related; boundary="${boundary}"`
            },
            body: multipartRequestBody
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.error?.message || 'Failed to upload file');
          }

          setSuccessMsg(`"${file.name}" uploaded to Google Drive!`);
          setIsUploading(false);
          setUploadProgress(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          fetchFiles(currentFolderId, searchQuery, activeFilter);
          fetchDriveAbout(token);
        } catch (err: any) {
          setErrorMsg(err.message || 'Upload error');
          setIsUploading(false);
          setUploadProgress(null);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read upload file');
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Toggle Star
  const handleToggleStar = async (file: DriveFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;

    try {
      const newStarred = !file.starred;
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ starred: newStarred })
      });

      if (!res.ok) throw new Error('Failed to update star');
      
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, starred: newStarred } : f));
      setSuccessMsg(newStarred ? `Starred "${file.name}"` : `Removed star from "${file.name}"`);
    } catch (err: any) {
      setErrorMsg('Error updating star status');
    }
  };

  // Move to Trash
  const handleDelete = async (file: DriveFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    if (!confirm(`Are you sure you want to move "${file.name}" to Google Drive Trash?`)) return;

    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trashed: true })
      });

      if (!res.ok) throw new Error('Failed to move to trash');

      setFiles(prev => prev.filter(f => f.id !== file.id));
      if (selectedFile?.id === file.id) {
        setIsPreviewOpen(false);
        setSelectedFile(null);
      }
      setSuccessMsg(`Moved "${file.name}" to Trash.`);
      fetchDriveAbout(token);
    } catch (err: any) {
      setErrorMsg('Failed to delete file');
    }
  };

  // Format File Size
  const formatBytes = (bytes?: string | number) => {
    if (!bytes) return '—';
    const num = Number(bytes);
    if (isNaN(num) || num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File Icon Mapper
  const renderFileIcon = (file: DriveFile, className: string = 'w-6 h-6') => {
    const mime = file.mimeType || '';
    if (mime === 'application/vnd.google-apps.folder') {
      return <Folder className={`${className} text-amber-400 fill-amber-400/20`} />;
    }
    if (mime.includes('document')) {
      return <FileText className={`${className} text-blue-400 fill-blue-400/10`} />;
    }
    if (mime.includes('spreadsheet')) {
      return <FileSpreadsheet className={`${className} text-emerald-400 fill-emerald-400/10`} />;
    }
    if (mime.includes('presentation')) {
      return <Presentation className={`${className} text-amber-500 fill-amber-500/10`} />;
    }
    if (mime === 'application/pdf') {
      return <FileText className={`${className} text-red-400 fill-red-400/10`} />;
    }
    if (mime.includes('image/')) {
      return <Image className={`${className} text-purple-400`} />;
    }
    if (mime.includes('video/')) {
      return <Film className={`${className} text-pink-400`} />;
    }
    if (mime.includes('audio/')) {
      return <Music className={`${className} text-cyan-400`} />;
    }
    if (mime.includes('zip') || mime.includes('compressed') || mime.includes('tar')) {
      return <Archive className={`${className} text-yellow-500`} />;
    }
    if (mime.includes('json') || mime.includes('javascript') || mime.includes('typescript') || mime.includes('html')) {
      return <FileCode className={`${className} text-indigo-400`} />;
    }
    return <File className={`${className} text-gray-400`} />;
  };

  // Helper for Quota Percentage
  const getStoragePercent = () => {
    if (!storageQuota?.limit || !storageQuota?.usage) return 0;
    const limit = Number(storageQuota.limit);
    const usage = Number(storageQuota.usage);
    if (limit === 0) return 0;
    return Math.min(100, Math.round((usage / limit) * 100));
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#C9D1D9] flex flex-col">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 bg-red-950 border border-red-500 text-red-200 px-4 py-3 rounded-xl shadow-2xl animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="border-b border-[#30363D] bg-[#161B22]/80 backdrop-blur px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-emerald-500/20 border border-blue-500/30">
              <HardDrive className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Google Drive Browser
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    WORKSPACE v3
                  </span>
                </h1>
              </div>
              <p className="text-xs text-[#8B949E]">
                Native high-speed file browser, previewer, and cloud document manager for your Google Drive
              </p>
            </div>
          </div>

          {/* Account & Storage Pill */}
          <div className="flex items-center space-x-3">
            {token && currentUser ? (
              <div className="flex items-center space-x-3 bg-[#0D1117] border border-[#30363D] px-3.5 py-2 rounded-xl">
                {currentUser.photoLink ? (
                  <img src={currentUser.photoLink} alt="Avatar" className="w-7 h-7 rounded-full border border-blue-500/50" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-semibold text-white leading-none">
                    {currentUser.displayName || currentUser.emailAddress}
                  </div>
                  <div className="text-[10px] text-[#8B949E] mt-0.5 font-mono">
                    {currentUser.emailAddress}
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  title="Disconnect Drive"
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all border border-blue-400/40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Connect Google Drive</span>
                </button>
                <button
                  onClick={() => setIsTokenModalOpen(true)}
                  className="text-xs text-[#8B949E] hover:text-white px-2.5 py-2 border border-[#30363D] hover:border-gray-500 rounded-xl transition-all"
                  title="Enter OAuth Access Token Manually"
                >
                  Enter Token
                </button>
              </div>
            )}

            {/* Storage Progress Bar */}
            {storageQuota?.limit && (
              <div className="hidden lg:flex flex-col w-40 bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-xl">
                <div className="flex justify-between text-[10px] text-[#8B949E] mb-1">
                  <span>Storage</span>
                  <span className="text-white font-mono">{formatBytes(storageQuota.usage)}</span>
                </div>
                <div className="w-full bg-[#21262D] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      getStoragePercent() > 85 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                    }`}
                    style={{ width: `${getStoragePercent()}%` }}
                  />
                </div>
                <span className="text-[9px] text-[#8B949E] text-right mt-0.5">
                  of {formatBytes(storageQuota.limit)} ({getStoragePercent()}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar (Search, Breadcrumbs, Upload, New Folder, View Mode) */}
      <div className="border-b border-[#30363D] bg-[#161B22]/50 px-6 py-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Breadcrumb Path Navigation */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-thin py-1">
            {breadcrumbs.length > 1 && (
              <button
                onClick={navigateUp}
                className="p-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white mr-1 transition-colors"
                title="Go up one level"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                <button
                  onClick={() => navigateToBreadcrumb(idx)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    idx === breadcrumbs.length - 1
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search Omnibox */}
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchFiles(currentFolderId, searchQuery, activeFilter);
                }}
                placeholder="Search files and folders in Drive..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={() => fetchFiles(currentFolderId, searchQuery, activeFilter)}
              className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-white rounded-xl transition-colors shrink-0"
            >
              Search
            </button>
          </div>

          {/* Right Action Controls: Upload, New Folder, Refresh, View Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Hidden native file input for upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !token}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
            </button>

            <button
              onClick={() => setIsCreateFolderOpen(true)}
              disabled={!token}
              className="flex items-center space-x-1.5 bg-[#21262D] hover:bg-[#30363D] disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#30363D] transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>New Folder</span>
            </button>

            <button
              onClick={() => fetchFiles(currentFolderId, searchQuery, activeFilter)}
              disabled={isLoadingFiles || !token}
              className="p-2 bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white rounded-xl border border-[#30363D] transition-colors"
              title="Refresh files"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <div className="flex items-center bg-[#0D1117] border border-[#30363D] p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-thin mt-3 pt-2 border-t border-[#21262D]">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'folders', label: 'Folders' },
            { id: 'docs', label: 'Google Docs' },
            { id: 'sheets', label: 'Spreadsheets' },
            { id: 'slides', label: 'Presentations' },
            { id: 'pdf', label: 'PDF Documents' },
            { id: 'media', label: 'Images & Media' },
            { id: 'starred', label: 'Starred' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-[#0D1117] text-[#8B949E] hover:text-white hover:bg-[#21262D] border border-[#30363D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex items-center space-x-2 text-xs text-[#8B949E] shrink-0">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0D1117] border border-[#30363D] rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="modified-desc">Last Modified (Newest)</option>
              <option value="modified-asc">Last Modified (Oldest)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {!token ? (
          /* Unauthenticated State Hero */
          <div className="max-w-xl mx-auto my-16 text-center bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-4">
              <HardDrive className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Google Drive</h2>
            <p className="text-xs text-[#8B949E] max-w-md mx-auto mb-6 leading-relaxed">
              Authenticate with your Google Account to browse files, preview documents and spreadsheets, upload assets, and manage cloud folders directly within Kronos Apex.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
              <button
                onClick={() => setIsTokenModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 border border-[#30363D] hover:bg-[#21262D] text-xs text-[#8B949E] hover:text-white rounded-xl transition-all"
              >
                Enter Access Token Manually
              </button>
            </div>
          </div>
        ) : isLoadingFiles ? (
          /* Loading Skeleton */
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-sm text-[#8B949E]">Loading files from Google Drive...</p>
          </div>
        ) : files.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-[#161B22]/30 border border-[#30363D] rounded-2xl p-8 max-w-lg mx-auto">
            <Folder className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-white mb-1">No files found</h3>
            <p className="text-xs text-[#8B949E] mb-5">
              {searchQuery ? `No files matching "${searchQuery}"` : 'This folder is currently empty.'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              Upload Your First File
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file) => {
              const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    if (isFolder) {
                      openFolder(file.id, file.name);
                    } else {
                      setSelectedFile(file);
                      setIsPreviewOpen(true);
                    }
                  }}
                  className="group bg-[#161B22] hover:bg-[#1c2128] border border-[#30363D] hover:border-blue-500/50 rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between relative shadow-sm hover:shadow-lg"
                >
                  {/* Top Bar: Icon + Star + Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D]">
                      {renderFileIcon(file, 'w-6 h-6')}
                    </div>
                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => handleToggleStar(file, e)}
                        className={`p-1.5 rounded-md hover:bg-[#30363D] transition-colors ${
                          file.starred ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'
                        }`}
                        title={file.starred ? 'Starred' : 'Star file'}
                      >
                        <Star className={`w-4 h-4 ${file.starred ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(file, e)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Move to trash"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail if available */}
                  {file.thumbnailLink && !isFolder && (
                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-[#0D1117] border border-[#30363D] flex items-center justify-center">
                      <img
                        src={file.thumbnailLink}
                        alt={file.name}
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {/* Name & Metadata */}
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 line-clamp-2 transition-colors mb-1" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-[#8B949E] mt-2">
                      <span>{isFolder ? 'Folder' : formatBytes(file.size)}</span>
                      {file.modifiedTime && (
                        <span>{new Date(file.modifiedTime).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[#30363D] text-[11px] font-semibold text-[#8B949E] uppercase tracking-wider bg-[#0D1117]/50">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Last Modified</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y divide-[#30363D]">
              {files.map((file) => {
                const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (isFolder) {
                        openFolder(file.id, file.name);
                      } else {
                        setSelectedFile(file);
                        setIsPreviewOpen(true);
                      }
                    }}
                    className="grid grid-cols-12 items-center px-4 py-3 text-xs hover:bg-[#21262D]/60 transition-colors cursor-pointer group"
                  >
                    <div className="col-span-6 flex items-center space-x-3 pr-2">
                      <div className="shrink-0">{renderFileIcon(file, 'w-5 h-5')}</div>
                      <span className="font-semibold text-white group-hover:text-blue-400 truncate" title={file.name}>
                        {file.name}
                      </span>
                      {file.starred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                    </div>
                    <div className="col-span-2 text-[#8B949E] truncate">
                      {file.owners?.[0]?.displayName || 'Me'}
                    </div>
                    <div className="col-span-2 text-[#8B949E] text-[11px]">
                      {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : '—'}
                    </div>
                    <div className="col-span-1 text-[#8B949E] font-mono text-[11px]">
                      {isFolder ? '—' : formatBytes(file.size)}
                    </div>
                    <div className="col-span-1 flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleStar(file, e)}
                        className={`p-1.5 rounded hover:bg-[#30363D] ${file.starred ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'}`}
                        title="Star"
                      >
                        <Star className={`w-3.5 h-3.5 ${file.starred ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(file, e)}
                        className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-950/40"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* File Preview & Inspector Modal */}
      {isPreviewOpen && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#30363D] flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-[#0D1117] border border-[#30363D] shrink-0">
                  {renderFileIcon(selectedFile, 'w-5 h-5')}
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-white truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </h3>
                  <p className="text-[11px] text-[#8B949E]">{selectedFile.mimeType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {selectedFile.webViewLink && (
                  <a
                    href={selectedFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    <span>Open in Drive</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
                {selectedFile.webContentLink && (
                  <a
                    href={selectedFile.webContentLink}
                    download
                    className="p-1.5 bg-[#21262D] hover:bg-[#30363D] text-white rounded-xl transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#30363D] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded Preview or Details */}
            <div className="p-6 flex-1 overflow-y-auto">
              {selectedFile.mimeType.includes('image/') && selectedFile.thumbnailLink ? (
                <div className="flex items-center justify-center p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                  <img
                    src={selectedFile.thumbnailLink.replace(/=s\d+/, '=s1000')}
                    alt={selectedFile.name}
                    referrerPolicy="no-referrer"
                    className="max-h-96 rounded-lg object-contain"
                  />
                </div>
              ) : selectedFile.webViewLink ? (
                <div className="h-96 w-full rounded-xl overflow-hidden border border-[#30363D] bg-[#0D1117]">
                  <iframe
                    src={selectedFile.webViewLink.replace('/view', '/preview')}
                    className="w-full h-full border-0"
                    title={selectedFile.name}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                </div>
              ) : (
                <div className="p-8 text-center bg-[#0D1117] rounded-xl border border-[#30363D]">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-xs text-[#8B949E]">Direct preview unavailable for this file format.</p>
                </div>
              )}

              {/* Metadata Attributes */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0D1117] border border-[#30363D]">
                <div>
                  <span className="text-[10px] text-[#8B949E] block uppercase font-mono">File Size</span>
                  <span className="text-xs font-semibold text-white">{formatBytes(selectedFile.size)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8B949E] block uppercase font-mono">Modified</span>
                  <span className="text-xs font-semibold text-white">
                    {selectedFile.modifiedTime ? new Date(selectedFile.modifiedTime).toLocaleString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8B949E] block uppercase font-mono">Owner</span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {selectedFile.owners?.[0]?.displayName || selectedFile.owners?.[0]?.emailAddress || 'Me'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8B949E] block uppercase font-mono">File ID</span>
                  <span className="text-xs font-mono text-blue-400 truncate block" title={selectedFile.id}>
                    {selectedFile.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {isCreateFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-400" />
              <span>Create New Folder</span>
            </h3>
            <p className="text-xs text-[#8B949E] mb-4">
              Enter a name for the folder in <span className="text-white font-semibold">{breadcrumbs[breadcrumbs.length - 1]?.name}</span>
            </p>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder title (e.g. Invoices 2026)"
                autoFocus
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateFolderOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-[#30363D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual OAuth Token Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Manual Google Workspace Access Token</span>
            </h3>
            <p className="text-xs text-[#8B949E] mb-4">
              If you have acquired a Google Workspace OAuth token via Google Identity Services or Google Cloud Console, paste it below.
            </p>
            <textarea
              rows={4}
              value={manualTokenInput}
              onChange={(e) => setManualTokenInput(e.target.value)}
              placeholder="ya29.a0Ac..."
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl p-3 text-xs font-mono text-emerald-300 outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-[#30363D] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (manualTokenInput.trim()) {
                    const trimmed = manualTokenInput.trim();
                    setToken(trimmed);
                    setGoogleWorkspaceToken(trimmed);
                    fetchDriveAbout(trimmed);
                    fetchFiles('root', '', 'all');
                    setIsTokenModalOpen(false);
                    setSuccessMsg('Access token updated!');
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Save Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
