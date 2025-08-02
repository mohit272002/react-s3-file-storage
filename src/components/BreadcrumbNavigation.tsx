import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbNavigationProps {
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

export const BreadcrumbNavigation = ({ currentPath, onNavigate }: BreadcrumbNavigationProps) => {
  const handleNavigateToPath = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    onNavigate(newPath);
  };

  // Convert URL-friendly names back to display names
  const getDisplayName = (urlName: string) => {
    return urlName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex items-center space-x-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate([])}
        className="h-8 px-2"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {currentPath.map((folder, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateToPath(index)}
            className="h-8 px-2 font-medium"
          >
            {getDisplayName(folder)}
          </Button>
        </div>
      ))}
    </div>
  );
};