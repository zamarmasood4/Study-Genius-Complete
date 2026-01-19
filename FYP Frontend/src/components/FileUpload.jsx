import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, FileText, File, Image, Loader } from 'lucide-react';

const FileUpload = ({ onFileUpload, onFileProcessed }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // Only allow PDF and JPEG
    const validTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg'
    ];
    
    const validExtensions = ['.pdf', '.jpg', '.jpeg'];
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes('.' + fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF or JPEG files",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit for large PDFs
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      if (onFileUpload) {
        await onFileUpload(file);
      }
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded for processing.`,
      });
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.type === 'application/pdf') {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else {
      return <Image className="h-10 w-10 text-blue-500" />;
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload your study material</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your PDF or JPEG file, or click to browse
            <br />
            <span className="text-xs">Supported: PDF, JPEG (Max: 50MB)</span>
          </p>
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload').click()}
          >
            Select File
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-background/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon()}
              <div>
                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removeFile}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              className="w-full" 
              onClick={uploadFile}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Document"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;