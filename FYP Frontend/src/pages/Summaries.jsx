import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Trash2, 
  Edit, 
  Download, 
  RefreshCw, 
  Copy,
  Check,
  Eye,
  FileText,
  Video,
  Calendar,
  Clock,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/services/api";
import EditModal from "@/components/EditModal";

const Summaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [filteredSummaries, setFilteredSummaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [summaryToEdit, setSummaryToEdit] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // ✅ Fetch all summaries
  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUserSummaries();
      console.log("Summaries response:", response);
      
      if (response.success) {
        const summariesData = response.summaries || response.data || [];
        setSummaries(summariesData);
        setFilteredSummaries(summariesData);
        
        if (summariesData.length === 0 && response.message) {
          toast({
            title: "No summaries yet",
            description: response.message,
          });
        }
      } else {
        toast({
          title: "No summaries found",
          description: response.message || "Start by creating your first summary",
        });
        setSummaries([]);
        setFilteredSummaries([]);
      }
    } catch (error) {
      console.error("Fetch summaries error:", error);
      toast({
        title: "Error loading summaries",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      setSummaries([]);
      setFilteredSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSummaries(summaries);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = summaries.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.content?.toLowerCase().includes(q) ||
          s.source_type?.toLowerCase().includes(q)
      );
      setFilteredSummaries(filtered);
    }
  }, [searchQuery, summaries]);

  // ✅ Handle Delete
  const handleDeleteSummary = async (id) => {
    if (!confirm("Are you sure you want to delete this summary?")) return;
    
    try {
      const response = await apiService.deleteSummary(id);
      if (response.success) {
        setSummaries((prev) => prev.filter((s) => s.id !== id));
        if (expandedSummary?.id === id) {
          setExpandedSummary(null);
        }
        toast({ 
          title: "Success", 
          description: "Summary deleted successfully" 
        });
      } else {
        throw new Error(response.message || "Failed to delete summary");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete summary",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle Delete All
  const handleDeleteAll = async () => {
    if (!confirm("⚠️ This will delete ALL your summaries. This action cannot be undone!")) return;
    
    try {
      const deletePromises = summaries.map(summary => 
        apiService.deleteSummary(summary.id)
      );
      
      await Promise.all(deletePromises);
      setSummaries([]);
      setFilteredSummaries([]);
      setExpandedSummary(null);
      toast({ 
        title: "Success", 
        description: "All summaries have been deleted" 
      });
    } catch (error) {
      console.error("Delete all error:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete all summaries",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle Edit
  const handleEditSummary = (summary) => {
    setSummaryToEdit(summary);
    setEditModalOpen(true);
  };

  const handleSaveEditedSummary = async (newContent) => {
    if (!summaryToEdit?.id) return;
    
    try {
      const response = await apiService.updateSummary(summaryToEdit.id, {
        content: newContent,
        title: summaryToEdit.title
      });
      
      if (response.success) {
        setSummaries((prev) =>
          prev.map((s) =>
            s.id === summaryToEdit.id ? { ...s, content: newContent } : s
          )
        );
        if (expandedSummary?.id === summaryToEdit.id) {
          setExpandedSummary(prev => ({ ...prev, content: newContent }));
        }
        toast({ 
          title: "Success", 
          description: "Summary updated successfully" 
        });
        setEditModalOpen(false);
        setSummaryToEdit(null);
      } else {
        throw new Error(response.message || "Failed to update summary");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: error.message || "Could not update summary",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle Copy
  const handleCopySummary = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: "Summary content copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle Download Single Summary
  const handleDownloadSingle = (summary) => {
    const content = `# ${summary.title}\n\n## Summary\n${summary.content}\n\n---\nSource: ${summary.source_type}\nCreated: ${formatDate(summary.created_at)}\nWords: ${summary.content.length}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${summary.title.replace(/\s+/g, '_')}_summary.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${summary.title} has been downloaded`,
    });
  };

  // ✅ Handle Download All
  const handleDownloadAll = () => {
    if (summaries.length === 0) {
      toast({
        title: "No data",
        description: "There are no summaries to download",
        variant: "destructive",
      });
      return;
    }

    const dataStr = JSON.stringify(summaries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `summaries-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export started",
      description: "All summaries are being exported as JSON",
    });
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  // ✅ Get word count
  const getWordCount = (text) => {
    return text ? text.split(/\s+/).length : 0;
  };

  // Summary Card Component
  const SummaryCard = ({ summary }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight flex-1 line-clamp-2">
            {summary.title || "Untitled Summary"}
          </CardTitle>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditSummary(summary)}
              className="h-7 w-7 p-0"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSummary(summary.id)}
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant={summary.source_type === 'document' ? 'default' : 'destructive'} className="text-xs">
            {summary.source_type === 'document' ? <FileText className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
            {summary.source_type || 'unknown'}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(summary.created_at)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {getWordCount(summary.content)} words
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {summary.content || "No content available"}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpandedSummary(summary)}
          className="flex-1 text-xs h-8"
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCopySummary(summary.content, summary.id)}
          className="text-xs h-8"
        >
          {copiedId === summary.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadSingle(summary)}
          className="text-xs h-8"
        >
          <Download className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Expanded View Component
  const ExpandedView = ({ summary, onClose }) => (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                summary.source_type === 'document' ? 'bg-blue-500/20' : 'bg-red-500/20'
              }`}>
                {summary.source_type === 'document' ? 
                  <FileText className="h-5 w-5 text-blue-500" /> : 
                  <Video className="h-5 w-5 text-red-500" />
                }
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{summary.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <Badge variant={summary.source_type === 'document' ? 'default' : 'destructive'}>
                    {summary.source_type}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(summary.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getWordCount(summary.content)} words
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopySummary(summary.content, summary.id)}
                className="h-9"
              >
                {copiedId === summary.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadSingle(summary)}
                className="h-9"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="prose prose-sm max-w-none">
            <div className="bg-muted/30 rounded-lg p-6 border">
              <p className="text-foreground leading-relaxed whitespace-pre-line text-base">
                {summary.content}
              </p>
            </div>
          </div>
        </div>
 
       
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Summaries
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage, view, and organize all your saved summaries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-80 h-11 bg-background/50 backdrop-blur-sm border-border/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchSummaries}
                disabled={loading}
                className="flex items-center gap-2 h-11 bg-background/50 backdrop-blur-sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadAll}
                className="h-11 bg-background/50 backdrop-blur-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              {summaries.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAll}
                  className="h-11"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              )}
            </div>
          </div>
        </div>        

        {/* Summary List */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Loading your summaries...</p>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <Card className="text-center py-16 border-2 border-dashed border-muted-foreground/20 bg-background/50">
            <CardContent>
              {searchQuery ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">No matches found</h3>
                  <p className="text-muted-foreground">
                    No summaries found for "<span className="text-foreground">{searchQuery}</span>"
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">No summaries yet</h3>
                  <p className="text-muted-foreground">
                    Create your first summary to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSummaries.map((summary) => (
              <SummaryCard key={summary.id} summary={summary} />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {summaryToEdit && (
          <EditModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSummaryToEdit(null);
            }}
            onSave={handleSaveEditedSummary}
            title={summaryToEdit.title}
            type={summaryToEdit.source_type}
            initialContent={summaryToEdit.content}
          />
        )}

        {/* Expanded View */}
        {expandedSummary && (
          <ExpandedView 
            summary={expandedSummary} 
            onClose={() => setExpandedSummary(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Summaries;