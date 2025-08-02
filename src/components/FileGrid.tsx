import { useState } from 'react';
import { MoreVertical, Download, Trash2, FileText, Image, Video, File, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url: string;
}

interface FileGridProps {
  files: FileItem[];
  onFileDeleted: (fileId: string) => void;
}

export const FileGrid = ({ files, onFileDeleted }: FileGridProps) => {
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="h-8 w-8 text-green-500" />;
    if (type.includes('text') || type.includes('document')) return <FileText className="h-8 w-8 text-orange-500" />;
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (file: FileItem) => {
    // TODO: Implement actual S3 download
    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
    });
  };

  const handleDelete = (file: FileItem) => {
    // TODO: Implement actual S3 delete via Supabase edge function
    onFileDeleted(file.id);
    toast({
      title: "File deleted",
      description: `${file.name} has been deleted.`,
    });
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No files yet</h3>
        <p className="text-muted-foreground">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="p-4 hover:shadow-md transition-shadow duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              {getFileIcon(file.type)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload(file)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(file)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{formatFileSize(file.size)}</p>
              <p>{formatDate(file.uploadedAt)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};