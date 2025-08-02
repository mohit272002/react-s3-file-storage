import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { FileGrid } from '@/components/FileGrid';
import { FileStorageHeader } from '@/components/FileStorageHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url: string;
  folderId?: string;
}

interface FolderItem {
  id: string;
  name: string;
  createdAt: string;
  fileCount: number;
}

const FileStorage = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  const [files, setFiles] = useState<FileItem[]>([
    // Mock data for demonstration
    {
      id: '1',
      name: 'presentation.pdf',
      size: 2547892,
      type: 'application/pdf',
      uploadedAt: '2024-01-15T10:30:00Z',
      url: '#',
      folderId: 'folder1'
    },
    {
      id: '2',
      name: 'vacation-photo.jpg',
      size: 1894736,
      type: 'image/jpeg',
      uploadedAt: '2024-01-14T16:45:00Z',
      url: '#'
    },
    {
      id: '3',
      name: 'meeting-recording.mp4',
      size: 45678912,
      type: 'video/mp4',
      uploadedAt: '2024-01-13T09:15:00Z',
      url: '#'
    }
  ]);

  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: 'folder1',
      name: 'Work Documents',
      createdAt: '2024-01-10T08:00:00Z',
      fileCount: 1
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');

  // Parse current path from URL
  const currentPath = useMemo(() => {
    const folderPath = params.folderPath || params['*'] || '';
    return folderPath ? folderPath.split('/').filter(Boolean) : [];
  }, [params]);

  const currentFolderId = useMemo(() => {
    if (currentPath.length === 0) return null;
    const folderName = currentPath[currentPath.length - 1];
    const folder = folders.find(f => f.name.toLowerCase().replace(/\s+/g, '-') === folderName);
    return folder?.id || null;
  }, [currentPath, folders]);

  // Update URL when path changes  
  useEffect(() => {
    const urlPath = currentPath.length > 0 ? `/${currentPath.join('/')}` : '/';
    if (window.location.pathname !== urlPath) {
      navigate(urlPath, { replace: true });
    }
  }, [currentPath, navigate]);

  const handleFileUploaded = (newFile: FileItem) => {
    const fileWithFolder = {
      ...newFile,
      folderId: currentFolderId || undefined
    };
    setFiles(prev => [fileWithFolder, ...prev]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFolderCreated = (folderName: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: folderName,
      createdAt: new Date().toISOString(),
      fileCount: 0
    };
    setFolders(prev => [newFolder, ...prev]);
  };

  const handleFolderDeleted = (folderId: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
    // Also delete files in this folder
    setFiles(prev => prev.filter(file => file.folderId !== folderId));
  };

  const handleFolderClick = (folderId: string, folderName: string) => {
    const urlFolderName = folderName.toLowerCase().replace(/\s+/g, '-');
    const newPath = [...currentPath, urlFolderName];
    navigate(`/${newPath.join('/')}`);
  };

  const handleNavigate = (path: string[]) => {
    const urlPath = path.length > 0 ? `/${path.join('/')}` : '/';
    navigate(urlPath);
  };

  const filteredAndSortedFiles = useMemo(() => {
    // Filter files by current folder and search term
    let filtered = files.filter(file => {
      const inCurrentFolder = currentFolderId ? file.folderId === currentFolderId : !file.folderId;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      return inCurrentFolder && matchesSearch;
    });

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        filtered.sort((a, b) => b.size - a.size);
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        break;
    }

    return filtered;
  }, [files, searchTerm, sortBy, currentFolderId]);

  const filteredAndSortedFolders = useMemo(() => {
    // Only show folders in root directory for now
    if (currentFolderId) return [];
    
    return folders.filter(folder =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [folders, searchTerm, currentFolderId]);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const currentFolderFiles = files.filter(file => 
    currentFolderId ? file.folderId === currentFolderId : !file.folderId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <FileStorageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFiles={currentFolderFiles.length}
          totalSize={totalSize}
          totalFolders={currentFolderId ? 0 : folders.length}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onFolderCreated={handleFolderCreated}
        />

        <div className="mt-8 space-y-8">
          {/* Upload Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </Card>

          <Separator />

          {/* Files Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Files</h2>
              <div className="text-sm text-muted-foreground">
                {filteredAndSortedFiles.length + filteredAndSortedFolders.length} items
              </div>
            </div>
            
            <FileGrid 
              files={filteredAndSortedFiles}
              folders={filteredAndSortedFolders}
              onFileDeleted={handleFileDeleted}
              onFolderDeleted={handleFolderDeleted}
              onFolderClick={handleFolderClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileStorage;