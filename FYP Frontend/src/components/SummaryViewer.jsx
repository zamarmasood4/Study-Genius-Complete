import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Save,
  FileText,
  Video,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/services/api";

const SummaryViewer = ({
  summary,
  type = "document",
  onSave,
  saveLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(summary);
  const hasSavedRef = useRef(false); // ✅ track saved state
  const { toast } = useToast();

  // Generate a temporary ID for unsaved summaries
  const tempId =
    summary?.id || summary?.title + (summary?.source_text?.slice(0, 20) || "");

  // Keep synced with parent & check localStorage for saved status
  useEffect(() => {
  setCurrentSummary(summary);

  // ✅ Auto-save only for documents, never for YouTube
  if (type === "document") {
    hasSavedRef.current = !!summary?.id;
  } else {
    hasSavedRef.current = true; // YouTube summaries are always treated as "saved"
  }
}, [summary, type]);



  // If no summary available
  if (!currentSummary) {
    return (
      <div className="border-2 border-dashed rounded-2xl p-8 bg-gradient-to-br from-card to-muted/30 text-center transition-all duration-300 hover:shadow-lg">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground/70 mb-2">
          No Summary Available
        </h3>
        <p className="text-muted-foreground">
          {type === "document"
            ? "Upload a document to generate a summary"
            : "Enter a YouTube URL to generate a summary"}
        </p>
      </div>
    );
  }

  const title = currentSummary.title || "Summary";
  const summaryText = currentSummary.summary || currentSummary.content || "";

  // ✅ Copy summary
  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    toast({
      title: "✨ Copied!",
      description: "Summary has been copied to your clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ✅ Download summary
  const handleDownload = () => {
    const fileContent = `# ${title}\n\n${summaryText}`;
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, "_")}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "📥 Download started!",
      description: "Your summary is being downloaded",
    });
  };

  // ✅ Save to history (only once)
  const handleSaveSummary = async () => {
    if (!summaryText) {
      toast({
        title: "No content to save",
        description: "There is no summary content to save",
        variant: "destructive",
      });
      return;
    }

    // Prevent duplicate save calls
    if (isSaving || currentSummary.id || hasSavedRef.current) {
      console.warn("Save skipped - already saved or in progress");
      return;
    }

    hasSavedRef.current = true;
    setIsSaving(true);

    try {
      const summaryData = {
        title,
        content: summaryText,
        source_text:
          currentSummary.transcript || currentSummary.source_text || "",
        source_type: type,
      };

      const response = await apiService.createSummary(summaryData);

      if (response.success) {
        toast({
          title: "🎉 Summary saved!",
          description: "Your summary has been saved to your history.",
        });

        // Update local state
        if (response.summary) setCurrentSummary(response.summary);

        // ✅ Mark as saved in localStorage for unsaved summaries
        const savedIds = JSON.parse(localStorage.getItem("saved_summaries") || "[]");
        if (tempId) {
          savedIds.push(tempId);
          localStorage.setItem("saved_summaries", JSON.stringify(savedIds));
        }

        // 🔥 Removed window.location.reload() to prevent button reappearing
      } else {
        throw new Error(response.message || "Failed to save summary");
      }
    } catch (error) {
      console.error("Save failed:", error);
      hasSavedRef.current = false;
      toast({
        title: "Save failed",
        description: error.message || "Could not save summary",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border-2 border-border rounded-2xl bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      {/* Header */}
      <div className="border-b border-border p-6 bg-gradient-to-r from-card to-muted/5">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                type === "document" ? "bg-blue-500/10" : "bg-red-500/10"
              }`}
            >
              {type === "document" ? (
                <FileText className="h-6 w-6 text-blue-500" />
              ) : (
                <Video className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-foreground mb-1">{title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span
                  className={`px-3 py-1 rounded-full ${
                    type === "document"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {type === "document" ? "Document" : "Video"}
                </span>
                {currentSummary.id && (
                  <span className="text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                    ✓ Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-200"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full"></div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Summary
              </h4>
            </div>
            <div className="bg-muted/20 rounded-xl p-6 border border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-line text-base">
                {summaryText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-border p-6 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="flex flex-wrap gap-3">
          {/* Copy */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="rounded-lg border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 text-foreground hover:text-green-600 transition-all duration-200 font-medium"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>

          {/* Download */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="rounded-lg border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10 text-foreground hover:text-blue-600 transition-all duration-200 font-medium"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          {/* Save only if not already saved */}
          {!currentSummary.id && !hasSavedRef.current && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveSummary}
              disabled={isSaving || saveLoading}
              className="rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg shadow-primary/25 font-medium"
            >
              {isSaving || saveLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to History
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
