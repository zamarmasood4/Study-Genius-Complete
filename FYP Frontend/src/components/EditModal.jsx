import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Edit3,
  Sparkles,
  FileText,
  Video,
  X,
  Save
} from 'lucide-react';

const EditModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  type, 
  initialContent,
  loading = false 
}) => {
  const [editedSummary, setEditedSummary] = useState(initialContent || "");

  // Sync with initialContent when it changes
  useEffect(() => {
    setEditedSummary(initialContent || "");
  }, [initialContent]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSave = () => {
    if (editedSummary.trim()) {
      onSave(editedSummary);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSave();
    }
  };

  // Reset when modal closes
  const handleClose = () => {
    setEditedSummary(initialContent || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="border-b border-border p-6 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Edit3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Edit Summary</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  {type === "document" ? <FileText className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  {title}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Summary Content
                <span className="text-muted-foreground text-sm ml-2 font-normal">
                  ({editedSummary.length} characters)
                </span>
              </label>
              <textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-96 p-4 text-base border-2 border-border rounded-xl resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background leading-relaxed"
                placeholder="Write or modify your summary here..."
                autoFocus
              />
            </div>
            
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Sparkles className="h-4 w-4" />
                <span>Quick Tips</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Press Ctrl+Enter to save quickly</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Changes update immediately</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border p-6 bg-muted/20">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="min-w-24 h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !editedSummary.trim()}
              className="min-w-32 h-11 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;