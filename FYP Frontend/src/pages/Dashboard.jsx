import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import YouTubeSummarizer from '@/components/YouTubeSummarizer';
import SummaryViewer from '@/components/SummaryViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Youtube, Lightbulb, CircleHelp, BookText, Calendar,
  BarChart, Brain, Clock, AlertCircle, 
  Sparkles, MessageCircle, History, Loader2, Download, ChevronDown, ChevronUp,
  Send, Trash2, User, Bot, Upload, FileIcon, RefreshCw, Zap, Globe, HelpCircle,
  Scan, Save, MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

// Local storage keys - UPDATED with separate keys
const STORAGE_KEYS = {
  CURRENT_DOCUMENT: 'current_document',
  DOCUMENT_SUMMARY: 'document_summary',
  SUMMARY_QUESTIONS: 'summary_questions', // Questions from summary
  PRACTICE_QUESTIONS: 'practice_questions', // Questions from practice tab
  CHAT_HISTORY: 'chat_history',
  UPLOADED_FILE: 'uploaded_file_data',
  OCR_DOCUMENT: 'ocr_document',
  OCR_SUMMARY: 'ocr_summary'
};

const Dashboard = () => {
  const [documentSummary, setDocumentSummary] = useState(null);
  const [videoSummary, setVideoSummary] = useState(null);
  // SEPARATE STATES FOR DIFFERENT QUESTION TYPES
  const [summaryQuestions, setSummaryQuestions] = useState(null); // From Study Material tab
  const [practiceQuestions, setPracticeQuestions] = useState(null); // From Practice Questions tab
  const [activeTab, setActiveTab] = useState("documents");
  const [showStats, setShowStats] = useState(false);
  const [processingState, setProcessingState] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // SEPARATE EXPANDED STATES
  const [expandedSummaryQuestions, setExpandedSummaryQuestions] = useState({});
  const [expandedPracticeQuestions, setExpandedPracticeQuestions] = useState({});
  
  // Chat states
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [currentDocumentFile, setCurrentDocumentFile] = useState(null);
  const [quickFacts, setQuickFacts] = useState("• Learning is a lifelong journey\n• Every question you ask helps you grow\n• Consistent study habits lead to success");
  
  // OCR states
  const [ocrSummary, setOcrSummary] = useState(null);
  const [ocrDocumentFile, setOcrDocumentFile] = useState(null);
  const [ocrSaveLoading, setOcrSaveLoading] = useState(false);
  
  // Text-based question generation for Practice Questions tab
  const [textForQuestions, setTextForQuestions] = useState('');
  const [isGeneratingFromText, setIsGeneratingFromText] = useState(false);
  
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load saved data
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
    loadSavedState();
  }, []);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const loadSavedState = () => {
    try {
      const savedDocument = localStorage.getItem(STORAGE_KEYS.CURRENT_DOCUMENT);
      const savedSummary = localStorage.getItem(STORAGE_KEYS.DOCUMENT_SUMMARY);
      const savedSummaryQuestions = localStorage.getItem(STORAGE_KEYS.SUMMARY_QUESTIONS);
      const savedPracticeQuestions = localStorage.getItem(STORAGE_KEYS.PRACTICE_QUESTIONS);
      const savedChat = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      const savedFile = localStorage.getItem(STORAGE_KEYS.UPLOADED_FILE);
      const savedOcrDocument = localStorage.getItem(STORAGE_KEYS.OCR_DOCUMENT);
      const savedOcrSummary = localStorage.getItem(STORAGE_KEYS.OCR_SUMMARY);

      if (savedFile) {
        const fileData = JSON.parse(savedFile);
        const file = new File([fileData.content], fileData.name, { type: fileData.type });
        setCurrentDocumentFile(file);
      }

      if (savedSummary) {
        setDocumentSummary(JSON.parse(savedSummary));
      }

      if (savedSummaryQuestions) {
        const questions = JSON.parse(savedSummaryQuestions);
        setSummaryQuestions(questions);
        
        const expanded = {};
        if (questions?.questions) {
          questions.questions.forEach((_, index) => {
            expanded[index] = false;
          });
        }
        setExpandedSummaryQuestions(expanded);
      }

      if (savedPracticeQuestions) {
        const questions = JSON.parse(savedPracticeQuestions);
        setPracticeQuestions(questions);
        
        const expanded = {};
        if (questions?.questions) {
          questions.questions.forEach((_, index) => {
            expanded[index] = false;
          });
        }
        setExpandedPracticeQuestions(expanded);
      }

      if (savedChat) {
        setChatHistory(JSON.parse(savedChat));
      }

      if (savedOcrDocument) {
        const fileData = JSON.parse(savedOcrDocument);
        const file = new File([fileData.content], fileData.name, { type: fileData.type });
        setOcrDocumentFile(file);
      }

      if (savedOcrSummary) {
        setOcrSummary(JSON.parse(savedOcrSummary));
      }
    } catch (error) {
      console.error("Error loading saved state:", error);
      clearSavedState();
    }
  };

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      toast({
        title: "Storage Error",
        description: "Could not save data to browser storage",
        variant: "destructive"
      });
    }
  };

  const clearSavedState = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    setCurrentDocumentFile(null);
    setDocumentSummary(null);
    setSummaryQuestions(null);
    setPracticeQuestions(null);
    setChatHistory([]);
    setExpandedSummaryQuestions({});
    setExpandedPracticeQuestions({});
    setOcrDocumentFile(null);
    setOcrSummary(null);
  };

  const clearOcrState = () => {
    localStorage.removeItem(STORAGE_KEYS.OCR_DOCUMENT);
    localStorage.removeItem(STORAGE_KEYS.OCR_SUMMARY);
    setOcrDocumentFile(null);
    setOcrSummary(null);
  };

  // OCR-specific handler
  const handleFileUploadOCR = async (file) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to upload documents",
        variant: "destructive"
      });
      return;
    }

    console.log("OCR File uploaded:", file);
    
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      content: file.size < 1024 * 1024 ? await file.arrayBuffer() : null
    };
    
    saveToLocalStorage(STORAGE_KEYS.OCR_DOCUMENT, fileData);
    setOcrDocumentFile(file);
    
    setProcessingState({
      type: 'ocr',
      status: 'processing',
      message: 'Uploading and processing document via OCR...'
    });
    
    try {
      const result = await apiService.uploadOCR(file);
      
      if (result.success) {
        setProcessingState({
          type: 'ocr',
          status: 'completed',
          message: 'Document processed successfully'
        });
        
        const summaryData = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          summary: result.summary.english_summary || result.summary.full_summary,
          keyPoints: result.summary.key_points || [],
          fullSummary: result.summary,
          sourceText: result.text_preview,
          text_preview: result.text_preview,
          timestamp: new Date().toISOString(),
          saved: false
        };
        
        setOcrSummary(summaryData);
        
        saveToLocalStorage(STORAGE_KEYS.OCR_SUMMARY, summaryData);
        
        toast({
          title: "OCR text extracted",
          description: `Successfully analyzed "${file.name}" and extracted text.`,
        });
      } else {
        throw new Error(result.message || "Processing failed");
      }
    } catch (error) {
      console.error("OCR processing error:", error);
      setProcessingState({
        type: 'ocr',
        status: 'error',
        message: error.message
      });
      
      toast({
        title: "OCR Processing Failed",
        description: error.message || "Failed to process document",
        variant: "destructive"
      });
    }
  };

  // Document handler for Study Material tab
  const handleFileUpload = async (file) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to upload documents",
        variant: "destructive"
      });
      return;
    }

    console.log("File uploaded:", file);
    
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      content: file.size < 1024 * 1024 ? await file.arrayBuffer() : null
    };
    
    saveToLocalStorage(STORAGE_KEYS.UPLOADED_FILE, fileData);
    setCurrentDocumentFile(file);
    
    setSummaryQuestions(null); // Clear summary questions when uploading new document
    setChatHistory([]);
    setExpandedSummaryQuestions({});
    localStorage.removeItem(STORAGE_KEYS.SUMMARY_QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    
    setProcessingState({
      type: 'document',
      status: 'processing',
      message: 'Uploading and processing document...'
    });
    
    try {
      const result = await apiService.uploadDocument(file);
      
      if (result.success) {
        setProcessingState({
          type: 'document',
          status: 'completed',
          message: 'Document processed successfully'
        });
        
        const summaryData = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          summary: result.summary.english_summary || result.summary.full_summary,
          keyPoints: result.summary.key_points || [],
          fullSummary: result.summary,
          sourceText: result.text_preview,
          text_preview: result.text_preview,
          timestamp: new Date().toISOString(),
          saved: false
        };
        
        setDocumentSummary(summaryData);
        
        saveToLocalStorage(STORAGE_KEYS.DOCUMENT_SUMMARY, summaryData);
        saveToLocalStorage(STORAGE_KEYS.CURRENT_DOCUMENT, {
          name: file.name,
          uploadedAt: new Date().toISOString()
        });
        
        toast({
          title: "Summary Generated",
          description: `Successfully analyzed "${file.name}". You can now ask questions!`,
        });
      } else {
        throw new Error(result.message || "Processing failed");
      }
    } catch (error) {
      console.error("File processing error:", error);
      setProcessingState({
        type: 'document',
        status: 'error',
        message: error.message
      });
      
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process document",
        variant: "destructive"
      });
    }
  };

  // Generate questions from summary (Study Material tab)
  const handleGenerateQuestionsFromSummary = async () => {
    if (!documentSummary?.summary) {
      toast({
        title: "No Summary",
        description: "Please upload and process a document first",
        variant: "destructive"
      });
      return;
    }

    setProcessingState({
      type: 'summary-questions',
      status: 'processing',
      message: 'Generating practice questions from summary...'
    });
    
    try {
      // Extract just the summary text from the documentSummary object
      const summaryText = documentSummary.summary;
      
      // Call the API with just the text
      const response = await apiService.generateQuestionsFromText({
        text: summaryText,
        num_questions: 10
      });
      
      if (response.success) {
        setProcessingState({
          type: 'summary-questions',
          status: 'completed',
          message: 'Questions generated successfully'
        });
        
        const formattedQuestions = {
          questions: response.questions?.questions || [],
          answers: response.questions?.answers || [],
          total_questions: response.total_questions || 0,
          generatedAt: new Date().toISOString(),
          source: 'summary' // Mark as from summary
        };
        
        setSummaryQuestions(formattedQuestions);
        
        const expanded = {};
        formattedQuestions.questions.forEach((_, index) => {
          expanded[index] = false;
        });
        setExpandedSummaryQuestions(expanded);
        
        saveToLocalStorage(STORAGE_KEYS.SUMMARY_QUESTIONS, formattedQuestions);
        
        toast({
          title: "Questions Generated",
          description: `Generated ${formattedQuestions.total_questions} practice questions from your document summary.`,
        });
      } else {
        throw new Error("No questions were generated");
      }
    } catch (error) {
      console.error("Question generation error:", error);
      setProcessingState({
        type: 'summary-questions',
        status: 'error',
        message: error.message
      });
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate questions",
        variant: "destructive"
      });
    }
  };

  // Generate questions from uploaded document (Practice Questions tab)
  const handleGenerateQuestionsFromDocument = async (file = null) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to generate questions",
        variant: "destructive"
      });
      return;
    }

    const targetFile = file || currentDocumentFile;
    
    if (!targetFile) {
      toast({
        title: "No Document",
        description: "Please upload a document first",
        variant: "destructive"
      });
      return;
    }

    setProcessingState({
      type: 'practice-questions',
      status: 'processing',
      message: 'Generating practice questions from document...'
    });
    
    try {
      const response = await apiService.generateQuestionsFromDocument(targetFile, 10);
      
      if (response.success) {
        setProcessingState({
          type: 'practice-questions',
          status: 'completed',
          message: 'Questions generated successfully'
        });
        
        const formattedQuestions = {
          questions: response.questions.questions || [],
          answers: response.questions.answers || [],
          total_questions: response.total_questions || 0,
          generatedAt: new Date().toISOString(),
          source: 'document' // Mark as from document
        };
        
        setPracticeQuestions(formattedQuestions);
        
        const expanded = {};
        formattedQuestions.questions.forEach((_, index) => {
          expanded[index] = false;
        });
        setExpandedPracticeQuestions(expanded);
        
        saveToLocalStorage(STORAGE_KEYS.PRACTICE_QUESTIONS, formattedQuestions);
        
        toast({
          title: "Questions Generated",
          description: `Generated ${formattedQuestions.total_questions} practice questions from your document.`,
        });
      } else {
        throw new Error("No questions were generated");
      }
    } catch (error) {
      console.error("Question generation error:", error);
      setProcessingState({
        type: 'practice-questions',
        status: 'error',
        message: error.message
      });
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate questions",
        variant: "destructive"
      });
    }
  };

  // Generate questions from custom text input (Practice Questions tab)
  const handleGenerateQuestionsFromText = async () => {
    if (!textForQuestions.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to generate questions from",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingFromText(true);
    
    try {
      // Use the backend endpoint for text-based question generation
      const response = await apiService.generateQuestionsFromText({
        text: textForQuestions,
        num_questions: 10
      });
      
      if (response.success) {
        const formattedQuestions = {
          questions: response.questions.questions || [],
          answers: response.questions.answers || [],
          total_questions: response.total_questions || 0,
          generatedAt: new Date().toISOString(),
          source: 'text' // Mark as from text input
        };
        
        setPracticeQuestions(formattedQuestions);
        
        const expanded = {};
        formattedQuestions.questions.forEach((_, index) => {
          expanded[index] = false;
        });
        setExpandedPracticeQuestions(expanded);
        
        saveToLocalStorage(STORAGE_KEYS.PRACTICE_QUESTIONS, formattedQuestions);
        
        toast({
          title: "Questions Generated",
          description: `Generated ${formattedQuestions.total_questions} practice questions from your text.`,
        });
      }
    } catch (error) {
      console.error("Text question generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate questions",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingFromText(false);
    }
  };

  // Chatbot functionality - Answer questions from document
const handleAskQuestion = async () => {
  if (!userQuestion.trim()) {
    toast({
      title: "Empty Question",
      description: "Please enter a question",
      variant: "destructive"
    });
    return;
  }

  if (!currentDocumentFile) {
    toast({
      title: "No Document",
      description: "Please upload a document first",
      variant: "destructive"
    });
    return;
  }

  setIsAskingQuestion(true);
  
  // Add user question to chat
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: userQuestion,
    timestamp: new Date().toISOString()
  };
  
  const updatedChat = [...chatHistory, userMessage];
  setChatHistory(updatedChat);
  setUserQuestion('');
  
  try {
    // Use the backend endpoint for document Q&A
    const response = await apiService.answerQuestionFromDocument(currentDocumentFile, userQuestion);
    
    // Check if response is successful
    if (response && response.answer) {
      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.answer.answer || response.answer || "I found information in your document, but couldn't generate a specific answer.",
        sourceReference: response.answer.source_reference || "",
        confidenceLevel: response.answer.confidence_level || "Medium",
        isDocumentRelated: true,
        timestamp: new Date().toISOString()
      };
      
      const finalChat = [...updatedChat, aiMessage];
      setChatHistory(finalChat);
      
      // Save updated chat history to localStorage
      saveToLocalStorage(STORAGE_KEYS.CHAT_HISTORY, finalChat);
      
    } else {
      // Handle case where response doesn't contain answer
      throw new Error(response?.message || "No answer found in the document");
    }
    
  } catch (error) {
    console.error("Error asking question:", error);
    
    const errorMessage = {
      id: Date.now() + 1,
      type: 'error',
      content: `Sorry, I couldn't find an answer to your question in the document. ${error.message || "Please try asking a different question."}`,
      timestamp: new Date().toISOString()
    };
    
    // Only add error message if it's a genuine error, not just "no answer"
    if (error.message && !error.message.includes("No answer found")) {
      setChatHistory([...updatedChat, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get answer from AI",
        variant: "destructive"
      });
    } else {
      // If no answer found, show a helpful message instead of error
      const noAnswerMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I couldn't find specific information about "${userQuestion}" in your document. Try asking about the main topics or key points.`,
        timestamp: new Date().toISOString()
      };
      setChatHistory([...updatedChat, noAnswerMessage]);
    }
  } finally {
    setIsAskingQuestion(false);
  }
};

  const handleClearChat = () => {
    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    toast({
      title: "Chat Cleared",
      description: "Chat history has been cleared",
    });
  };

  const handleProcessNewDocument = () => {
    clearSavedState();
    toast({
      title: "Ready for New Document",
      description: "All previous data has been cleared. You can now upload a new document.",
    });
  };

  const handleSaveSummary = async () => {
    if (!documentSummary) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to save summaries",
        variant: "destructive"
      });
      return;
    }

    setSaveLoading(true);
    try {
      const summaryData = {
        title: documentSummary.title,
        content: documentSummary.fullSummary?.full_summary || documentSummary.summary,
        source_text: documentSummary.sourceText || documentSummary.text_preview || "",
        source_type: "document"
      };

      const response = await apiService.createSummary(summaryData);
      
      if (response.success) {
        toast({
          title: "Summary Saved",
          description: "Your summary has been saved to your history",
        });
        
        setDocumentSummary({
          ...documentSummary,
          saved: true
        });
        
        saveToLocalStorage(STORAGE_KEYS.DOCUMENT_SUMMARY, {
          ...documentSummary,
          saved: true
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message || "Could not save summary",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveOcrSummary = async () => {
    if (!ocrSummary) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to save summaries",
        variant: "destructive"
      });
      return;
    }

    setOcrSaveLoading(true);
    try {
      const summaryData = {
        title: ocrSummary.title,
        content: ocrSummary.fullSummary?.full_summary || ocrSummary.summary,
        source_text: ocrSummary.sourceText || ocrSummary.text_preview || "",
        source_type: "ocr"
      };

      const response = await apiService.createSummary(summaryData);
      
      if (response.success) {
        toast({
          title: "OCR Summary Saved",
          description: "Your OCR summary has been saved to your history",
        });
        
        setOcrSummary({
          ...ocrSummary,
          saved: true
        });
        
        saveToLocalStorage(STORAGE_KEYS.OCR_SUMMARY, {
          ...ocrSummary,
          saved: true
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message || "Could not save OCR summary",
        variant: "destructive"
      });
    } finally {
      setOcrSaveLoading(false);
    }
  };

  const handleVideoSummarize = (summary) => {
    console.log("Video summarized:", summary);
    setVideoSummary(summary);
    toast({
      title: "Video Summarized",
      description: "Successfully extracted key points from the video.",
    });
  };

  const toggleSummaryQuestion = (index) => {
    setExpandedSummaryQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const togglePracticeQuestion = (index) => {
    setExpandedPracticeQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Tab items
  const tabItems = [
    { value: "documents", label: "Study Material", icon: FileText },
    { value: "ocr", label: "OCR", icon: Scan },
    { value: "videos", label: "Video Analysis", icon: Youtube },
    { value: "questions", label: "Practice Questions", icon: CircleHelp },
    { value: "chatbot", label: "Document Chatbot", icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      
      <main className="app-container py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">Your Study Dashboard</h1>
              <p className="text-muted-foreground">Access all your study tools and materials in one place</p>
              
              {/* Current document status */}
              {currentDocumentFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileIcon className="h-3 w-3" />
                  <span>Current document: {currentDocumentFile.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleProcessNewDocument}
                    className="h-6 px-2 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowStats(!showStats)}
                className="flex items-center"
              >
                <BarChart className="h-4 w-4 mr-2" />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/summaries" className="flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Link>
              </Button>
            </div>
          </div>
          
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{currentDocumentFile ? '1' : '0'}</div>
                  <div className="text-xs text-muted-foreground">Active Document</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Scan className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{ocrDocumentFile ? '1' : '0'}</div>
                  <div className="text-xs text-muted-foreground">OCR Document</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Youtube className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground">Videos</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <CircleHelp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{summaryQuestions?.questions?.length || 0} + {practiceQuestions?.questions?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Total Questions</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="glass-card p-4 rounded-xl border border-border/40 flex items-center space-x-4 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{chatHistory.length}</div>
                  <div className="text-xs text-muted-foreground">Chat Messages</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl blur-lg -z-10 opacity-50"></div>
              <TabsList className="grid grid-cols-5 max-w-4xl mx-auto bg-muted rounded-lg p-1">
                {tabItems.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="dashboard-tab">
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {/* Documents Tab - Shows SUMMARY QUESTIONS only */}
            <TabsContent value="documents" className="space-y-6 animate-fade-in">
              <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Upload Study Material
                  </CardTitle>
                  <CardDescription>
                    Upload PDFs, documents or notes for AI analysis and summary generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {currentDocumentFile && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileIcon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{currentDocumentFile.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {currentDocumentFile.size > 1024 * 1024 
                              ? `${(currentDocumentFile.size / (1024 * 1024)).toFixed(1)} MB`
                              : `${(currentDocumentFile.size / 1024).toFixed(1)} KB`}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This document is saved and will be used for all operations until you clear it.
                        </p>
                      </div>
                    )}
                    
                    <FileUpload onFileUpload={handleFileUpload} />
                  </div>
                  
                  {/* Processing Status */}
                  {processingState.type === 'document' && processingState.status === 'processing' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {processingState.message}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {processingState.type === 'document' && processingState.status === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          {processingState.message}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Document Summary - FULL WIDTH */}
              {documentSummary && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                      <CardTitle className="text-xl flex items-center">
                        <BookText className="mr-2 h-5 w-5 text-primary" />
                        Document Summary
                      </CardTitle>
                      <CardDescription>
                        AI-generated summary of your document: {documentSummary.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <SummaryViewer 
                        summary={documentSummary} 
                        type="document" 
                      />
                      
                      {/* Generate Questions from Summary */}
                      <div className="mt-8 pt-8 border-t border-border/30">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <CircleHelp className="h-5 w-5 mr-2 text-primary" />
                          Generate Practice Questions
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Generate practice questions based on the summary of your document.
                        </p>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleGenerateQuestionsFromSummary}
                            disabled={processingState.type === 'summary-questions' && processingState.status === 'processing'}
                            className="flex-1"
                          >
                            {processingState.type === 'summary-questions' && processingState.status === 'processing' ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating Questions...
                              </>
                            ) : (
                              <>
                                <CircleHelp className="h-4 w-4 mr-2" />
                                Generate Questions from Summary
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            onClick={() => setActiveTab("chatbot")}
                            variant="outline"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ask Questions about Document
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Display SUMMARY QUESTIONS ONLY in Study Material tab */}
                  {summaryQuestions && summaryQuestions.questions && summaryQuestions.questions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-6"
                    >
                      <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                <CircleHelp className="h-5 w-5 mr-2 text-primary" />
                                Questions from Document Summary ({summaryQuestions.questions.length})
                              </CardTitle>
                              <CardDescription>
                                Practice questions generated from your document summary
                              </CardDescription>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const content = `QUESTIONS FROM DOCUMENT SUMMARY:\n\n${summaryQuestions.questions.map((q, i) => `${i+1}. ${q}`).join('\n')}\n\nANSWERS:\n\n${summaryQuestions.answers.map((a, i) => `${i+1}. ${a}`).join('\n')}`;
                                const blob = new Blob([content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `summary_questions_${documentSummary?.title || 'document'}_${new Date().toISOString().split('T')[0]}.txt`;
                                a.click();
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {summaryQuestions.questions.map((question, index) => (
                              <div key={index} className="border border-border rounded-lg overflow-hidden bg-white">
                                <button
                                  className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                                  onClick={() => toggleSummaryQuestion(index)}
                                >
                                  <span className="font-medium flex items-start">
                                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                      {index + 1}
                                    </span>
                                    <span className="text-left">{question}</span>
                                  </span>
                                  {expandedSummaryQuestions[index] ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                                  )}
                                </button>
                                
                                {expandedSummaryQuestions[index] && summaryQuestions.answers && summaryQuestions.answers[index] && (
                                  <div className="p-4 bg-green-50 border-t border-green-200">
                                    <div className="flex items-start">
                                      <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                        A
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-medium text-green-700 mb-1">Answer:</p>
                                        <p className="text-green-800">{summaryQuestions.answers[index]}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </TabsContent>
            
            {/* OCR Tab - Unchanged */}
            <TabsContent value="ocr" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Scan className="mr-2 h-5 w-5 text-primary" />
                      OCR Document Processing
                    </CardTitle>
                    <CardDescription>
                      Upload images or scanned documents for OCR text extraction and summary
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {ocrDocumentFile && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileIcon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{ocrDocumentFile.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {ocrDocumentFile.size > 1024 * 1024 
                                  ? `${(ocrDocumentFile.size / (1024 * 1024)).toFixed(1)} MB`
                                  : `${(ocrDocumentFile.size / 1024).toFixed(1)} KB`}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={clearOcrState}
                                className="h-6 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <FileUpload 
                        onFileUpload={handleFileUploadOCR}
                        accept=".jpg,.jpeg,.png,.pdf"
                        description="Upload images or scanned documents for OCR processing"
                      />
                    </div>
                    
                    {/* Processing Status */}
                    {processingState.type === 'ocr' && processingState.status === 'processing' && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            {processingState.message}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {processingState.type === 'ocr' && processingState.status === 'error' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {processingState.message}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          <BookText className="mr-2 h-5 w-5 text-primary" />
                          OCR Summary
                        </CardTitle>
                        <CardDescription>
                          View extracted text and AI-generated summary from your document
                        </CardDescription>
                      </div>
                      {ocrSummary && (
                        <Button 
                          onClick={handleSaveOcrSummary}
                          disabled={ocrSaveLoading || ocrSummary?.saved}
                          size="sm"
                          variant={ocrSummary?.saved ? "secondary" : "default"}
                          className="flex items-center gap-2"
                        >
                          {ocrSaveLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : ocrSummary?.saved ? (
                            <>
                              <Save className="h-4 w-4" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Summary
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <SummaryViewer 
                      summary={ocrSummary} 
                      type="ocr" 
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Videos Tab - Unchanged */}
            <TabsContent value="videos" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Youtube className="mr-2 h-5 w-5 text-primary" />
                      YouTube Video Processing
                    </CardTitle>
                    <CardDescription>
                      Extract key points from educational videos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <YouTubeSummarizer onSummarize={handleVideoSummarize} />
                  </CardContent>
                </Card>
                
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <BookText className="mr-2 h-5 w-5 text-primary" />
                      Video Summary
                    </CardTitle>
                    <CardDescription>
                      View AI-generated insights from your video
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <SummaryViewer summary={videoSummary} type="video" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Practice Questions Tab - Shows PRACTICE QUESTIONS only */}
            <TabsContent value="questions" className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                      Generate Questions from Document
                    </CardTitle>
                    <CardDescription>
                      Upload a document to generate practice questions from its content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="flex items-center p-3 rounded-lg border border-accent/20 bg-accent/5 mb-6">
                        <AlertCircle className="h-5 w-5 text-accent mr-3" />
                        <p className="text-sm">
                          Upload a document and generate practice questions based on its content.
                          Questions will be generated from the document text, not from the summary.
                        </p>
                      </div>
                      
                      <FileUpload 
                        onFileUpload={(file) => {
                          handleGenerateQuestionsFromDocument(file);
                        }}
                        buttonText="Upload Document & Generate Questions"
                      />
                    </div>
                    
                    {/* Or use current document */}
                    {currentDocumentFile && (
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileIcon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{currentDocumentFile.name}</span>
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => handleGenerateQuestionsFromDocument()}
                            disabled={processingState.type === 'practice-questions' && processingState.status === 'processing'}
                            size="sm"
                          >
                            {processingState.type === 'practice-questions' && processingState.status === 'processing' ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <CircleHelp className="h-4 w-4 mr-2" />
                                Generate from Current Document
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                      Generate Questions from Text
                    </CardTitle>
                    <CardDescription>
                      Paste any text to generate practice questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Paste your study material text here..."
                        value={textForQuestions}
                        onChange={(e) => setTextForQuestions(e.target.value)}
                        className="min-h-[150px] resize-none"
                      />
                      
                      <Button 
                        onClick={handleGenerateQuestionsFromText}
                        disabled={!textForQuestions.trim() || isGeneratingFromText}
                        className="w-full"
                      >
                        {isGeneratingFromText ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating Questions...
                          </>
                        ) : (
                          <>
                            <CircleHelp className="h-4 w-4 mr-2" />
                            Generate Questions from Text
                          </>
                        )}
                      </Button>
                      
                      {!textForQuestions.trim() && (
                        <p className="text-sm text-muted-foreground text-center">
                          Enter some text above to generate questions
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Display PRACTICE QUESTIONS ONLY in Practice Questions tab */}
              {practiceQuestions && practiceQuestions.questions && practiceQuestions.questions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl flex items-center">
                            <CircleHelp className="h-5 w-5 mr-2 text-primary" />
                            Practice Questions ({practiceQuestions.questions.length})
                          </CardTitle>
                          <CardDescription>
                            Questions generated from {practiceQuestions.source === 'document' ? 'document content' : 'text input'}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const content = `PRACTICE QUESTIONS (Generated from ${practiceQuestions.source}):\n\n${practiceQuestions.questions.map((q, i) => `${i+1}. ${q}`).join('\n')}\n\nANSWERS:\n\n${practiceQuestions.answers.map((a, i) => `${i+1}. ${a}`).join('\n')}`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `practice_questions_${practiceQuestions.source}_${new Date().toISOString().split('T')[0]}.txt`;
                            a.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {practiceQuestions.questions.map((question, index) => (
                          <div key={index} className="border border-border rounded-lg overflow-hidden bg-white">
                            <button
                              className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                              onClick={() => togglePracticeQuestion(index)}
                            >
                              <span className="font-medium flex items-start">
                                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-left">{question}</span>
                              </span>
                              {expandedPracticeQuestions[index] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                              )}
                            </button>
                            
                            {expandedPracticeQuestions[index] && practiceQuestions.answers && practiceQuestions.answers[index] && (
                              <div className="p-4 bg-green-50 border-t border-green-200">
                                <div className="flex items-start">
                                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                    A
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-green-700 mb-1">Answer:</p>
                                    <p className="text-green-800">{practiceQuestions.answers[index]}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            {/* Document Chatbot Tab - Unchanged */}
            <TabsContent value="chatbot" className="space-y-6 animate-fade-in">
              {/* ... Chatbot tab content remains exactly the same as before ... */}
              <Card className="border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                        Document Chatbot
                      </CardTitle>
                      <CardDescription>
                        Ask questions about your uploaded document and get AI-powered answers
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {chatHistory.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleClearChat}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!currentDocumentFile ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Document Uploaded</h3>
                      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Upload a document first to ask questions about its content.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={() => setActiveTab("documents")}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Current document info */}
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium flex items-center">
                              <FileIcon className="h-4 w-4 mr-2" />
                              Current Document: {currentDocumentFile.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Ask any question about this document. The AI will answer based on its content.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveTab("documents")}
                            >
                              Change Document
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setUserQuestion("What are the main points of this document?");
                              }}
                            >
                              <HelpCircle className="h-4 w-4 mr-2" />
                              Example
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Chat interface */}
                      <div className="space-y-4">
                        <div 
                          ref={chatContainerRef}
                          className="border rounded-lg h-[400px] overflow-y-auto p-4 space-y-4 bg-muted/20"
                        >
                          {chatHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">Ask About Your Document</h3>
                              <p className="text-muted-foreground max-w-md mb-6">
                                Ask any question about the document: {currentDocumentFile.name}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                                <Button 
                                  variant="outline" 
                                  className="h-auto py-3 justify-start text-left"
                                  onClick={() => setUserQuestion("What are the main points of this document?")}
                                >
                                  <div>
                                    <p className="font-medium">Main Points</p>
                                    <p className="text-xs text-muted-foreground">Key takeaways</p>
                                  </div>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="h-auto py-3 justify-start text-left"
                                  onClick={() => setUserQuestion("Explain the most important concepts")}
                                >
                                  <div>
                                    <p className="font-medium">Key Concepts</p>
                                    <p className="text-xs text-muted-foreground">Important ideas</p>
                                  </div>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="h-auto py-3 justify-start text-left"
                                  onClick={() => setUserQuestion("What conclusions can be drawn?")}
                                >
                                  <div>
                                    <p className="font-medium">Conclusions</p>
                                    <p className="text-xs text-muted-foreground">Final thoughts</p>
                                  </div>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="h-auto py-3 justify-start text-left"
                                  onClick={() => setUserQuestion("Summarize the document in 3 sentences")}
                                >
                                  <div>
                                    <p className="font-medium">Brief Summary</p>
                                    <p className="text-xs text-muted-foreground">Quick overview</p>
                                  </div>
                                </Button>
                              </div>
                            </div>
                          ) : (
                            chatHistory.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg p-3 ${
                                    message.type === 'user'
                                      ? 'bg-primary text-primary-foreground'
                                      : message.type === 'error'
                                      ? 'bg-destructive/10 text-destructive-foreground border border-destructive/20'
                                      : 'bg-green-50 border border-green-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {message.type === 'user' ? (
                                      <User className="h-3 w-3" />
                                    ) : message.type === 'error' ? (
                                      <AlertCircle className="h-3 w-3" />
                                    ) : (
                                      <MessageSquare className="h-3 w-3 text-green-600" />
                                    )}
                                    <span className="text-xs font-medium">
                                      {message.type === 'user' ? 'You' : 
                                       message.type === 'error' ? 'Error' : 
                                       'Document Assistant'}
                                    </span>
                                    <span className="text-xs opacity-70 ml-auto">
                                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                  {message.confidenceLevel && (
                                    <div className="mt-2 pt-2 border-t border-green-200">
                                      <p className="text-xs text-green-600">
                                        Confidence: <span className="font-medium">{message.confidenceLevel}</span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                          
                          {isAskingQuestion && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] rounded-lg p-3 bg-background border">
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span className="text-xs font-medium">Document Assistant</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm">Searching document...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Input area */}
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Textarea
                              placeholder={`Ask a question about "${currentDocumentFile.name}"...`}
                              value={userQuestion}
                              onChange={(e) => setUserQuestion(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAskQuestion();
                                }
                              }}
                              disabled={isAskingQuestion}
                              className="min-h-[60px] resize-none"
                            />
                            <Button 
                              onClick={handleAskQuestion}
                              disabled={!userQuestion.trim() || isAskingQuestion}
                              className="self-end h-[60px]"
                            >
                              {isAskingQuestion ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                              Ask questions about your document. Press Enter to send.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Study Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-border/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Today's Study Tips
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="bg-primary/10 p-2 rounded-full w-fit mb-4">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Pomodoro Technique</h3>
                <p className="text-sm text-muted-foreground">Study for 25 minutes, then take a 5-minute break. Repeat 4 times, then take a longer break.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="bg-primary/10 p-2 rounded-full w-fit mb-4">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Active Recall</h3>
                <p className="text-sm text-muted-foreground">Test yourself on material instead of passively re-reading. Quiz yourself on key concepts.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/40 bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="bg-primary/10 p-2 rounded-full w-fit mb-4">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Teach to Learn</h3>
                <p className="text-sm text-muted-foreground">Explaining concepts to others reinforces your understanding and reveals knowledge gaps.</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;