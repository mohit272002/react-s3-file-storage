import { Search, Grid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateFolderDialog } from './CreateFolderDialog';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';

interface FileStorageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  totalFiles: number;
  totalSize: number;
  totalFolders: number;
  currentPath: string[];
  onNavigate: (path: string[]) => void;
  onFolderCreated: (folderName: string) => void;
}

export const FileStorageHeader = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  totalFiles,
  totalSize,
  totalFolders,
  currentPath,
  onNavigate,
  onFolderCreated
}: FileStorageHeaderProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            File Storage
          </h1>
          <p className="text-muted-foreground mt-1">
            {totalFolders} folders • {totalFiles} files • {formatFileSize(totalSize)} total
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <CreateFolderDialog onFolderCreated={onFolderCreated} />
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation currentPath={currentPath} onNavigate={onNavigate} />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date uploaded</SelectItem>
              <SelectItem value="size">File size</SelectItem>
              <SelectItem value="type">File type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};