import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileUploaded: (file: any) => void;
}

export const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    for (const file of files) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Implement actual S3 upload via Supabase edge function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mock file object for now
      const uploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        url: '#' // Will be S3 URL
      };

      onFileUploaded(uploadedFile);
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-upload-zone-border bg-upload-zone scale-105' 
            : 'border-muted-foreground/25 hover:border-upload-zone-border hover:bg-upload-zone/50'
          }
          ${uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted'} transition-colors`}>
            <Upload className="h-8 w-8" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {uploading ? 'Uploading...' : isDragOver ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-muted-foreground">
              {uploading ? 'Please wait while we upload your files' : 'Drag and drop files here, or click to browse'}
            </p>
          </div>

          {!uploading && (
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          )}
        </div>

        {uploading && (
          <div className="mt-6 space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
};