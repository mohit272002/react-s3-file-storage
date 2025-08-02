import { useState, useMemo } from 'react';
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
}

const FileStorage = () => {
  const [files, setFiles] = useState<FileItem[]>([
    // Mock data for demonstration
    {
      id: '1',
      name: 'presentation.pdf',
      size: 2547892,
      type: 'application/pdf',
      uploadedAt: '2024-01-15T10:30:00Z',
      url: '#'
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');

  const handleFileUploaded = (newFile: FileItem) => {
    setFiles(prev => [newFile, ...prev]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [files, searchTerm, sortBy]);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

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
          totalFiles={files.length}
          totalSize={totalSize}
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
                {filteredAndSortedFiles.length} of {files.length} files
              </div>
            </div>
            
            <FileGrid 
              files={filteredAndSortedFiles} 
              onFileDeleted={handleFileDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileStorage;