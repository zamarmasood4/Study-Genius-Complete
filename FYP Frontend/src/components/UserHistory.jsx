import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Edit3,
  FileText,
  Video,
  Calendar
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { apiService } from '@/services/api';
import EditModal from './EditModal';

const UserHistory = ({ summary, type = "document", onUpdate, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const { toast } = useToast();
  const cardRef = useRef(null);

  // Auto-scroll to card when it gets updated
  useEffect(() => {
    if (isEditing && cardRef.current) {
      cardRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  }, [isEditing]);

  if (!summary) {
    return (
      <div className="border rounded-lg p-8 bg-card text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">No Summary Available</h3>
      </div>
    );
  }

  const title = summary.title || "Summary";
  const summaryText = summary.summary || summary.content || "";
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileContent = `# ${title}\n\n## Summary\n${summaryText}`;
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Download started",
      description: "Your summary is being downloaded",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (editedContent) => {
    if (!editedContent.trim()) {
      toast({
        title: "Empty summary",
        description: "Please add some content to the summary",
        variant: "destructive"
      });
      return;
    }

    setEditLoading(true);
    
    try {
      if (summary.id) {
        const updateData = { content: editedContent, title: title };
        const response = await apiService.updateSummary(summary.id, updateData);
        
        if (response.success) {
          toast({
            title: "Summary updated!",
            description: "Your changes have been saved successfully",
          });
          
          if (onUpdate) {
            onUpdate({ ...summary, content: editedContent, summary: editedContent });
          }
        }
      } else {
        if (onUpdate) {
          onUpdate({ ...summary, content: editedContent, summary: editedContent });
        }
        toast({
          title: "Summary updated!",
          description: "Your changes have been applied",
        });
      }
      
      setIsEditing(false);
      
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update summary",
        variant: "destructive"
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div ref={cardRef} className="border rounded-lg bg-card overflow-hidden mb-4">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${type === "document" ? "bg-blue-500/10" : "bg-red-500/10"}`}>
                {type === "document" ? (
                  <FileText className="h-5 w-5 text-blue-500" />
                ) : (
                  <Video className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className={`px-2 py-1 rounded ${type === "document" ? "bg-blue-500/10 text-blue-600" : "bg-red-500/10 text-red-600"}`}>
                    {type === "document" ? "Document" : "Video"}
                  </span>
                  {summary.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(summary.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Content */}
        {isExpanded && (
          <div className="p-4">
            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-foreground whitespace-pre-line">{summaryText}</p>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="border-t p-4 bg-muted/50">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit3 className="h-4 w-4 mr-1" /> Edit
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {isCopied ? "Copied" : "Copy"}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditing}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        title={title}
        type={type}
        initialContent={summaryText}
        loading={editLoading}
      />
    </>
  );
};

export default UserHistory;