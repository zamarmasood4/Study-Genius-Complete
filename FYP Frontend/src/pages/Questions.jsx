import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, Upload, FileText, BookOpen, Brain, 
  Loader2, Download, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

const Questions = () => {
  const [activeTab, setActiveTab] = useState("past-papers");
  const [studyMaterialFile, setStudyMaterialFile] = useState(null);
  const [pastPaperFile, setPastPaperFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const handleStudyMaterialUpload = (file) => {
    setStudyMaterialFile(file);
    toast({
      title: "Study Material Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handlePastPaperUpload = (file) => {
    setPastPaperFile(file);
    toast({
      title: "Past Paper Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleAnalyze = async () => {
    if (!studyMaterialFile || !pastPaperFile) {
      toast({
        title: "Files Required",
        description: "Please upload both study material and past paper files.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('study_material_file', studyMaterialFile);
      formData.append('past_paper_file', pastPaperFile);
      formData.append('num_questions', '10');

      const response = await fetch(`${apiService.API_BASE}/past-papers/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiService.token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalysisResult(result.analysis);
        setExpandedQuestions({});
        
        toast({
          title: "Analysis Complete",
          description: `Generated ${result.analysis.questions.length} questions based on past paper patterns.`,
        });
      } else {
        throw new Error(result.message || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze past papers",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDownload = () => {
    if (!analysisResult) return;
    
    let content = `# Past Paper Analysis Results\n\n`;
    content += `## Study Material: ${studyMaterialFile?.name}\n`;
    content += `## Past Paper: ${pastPaperFile?.name}\n\n`;
    
    content += `## Analysis:\n${analysisResult.analysis}\n\n`;
    
    content += `## Generated Questions:\n\n`;
    analysisResult.questions.forEach((question, index) => {
      content += `${index + 1}. ${question}\n`;
      if (analysisResult.answers[index]) {
        content += `   Answer: ${analysisResult.answers[index]}\n\n`;
      }
    });
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `past_paper_analysis_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Complete",
      description: "Analysis results have been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="app-container py-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Past Paper Analysis</h1>
        <p className="text-muted-foreground mb-8">Upload study material and past papers to generate exam-style questions</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-1 max-w-md bg-muted rounded-lg p-1">
            <TabsTrigger value="past-papers" className="dashboard-tab">
              <Brain className="h-4 w-4 mr-2" />
              Past Paper Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="past-papers" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Study Material Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Study Material
                  </CardTitle>
                  <CardDescription>
                    Upload your notes, textbooks, or study content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handleStudyMaterialUpload} />
                  {studyMaterialFile && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {studyMaterialFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Past Paper Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Past Paper
                  </CardTitle>
                  <CardDescription>
                    Upload previous exam papers for pattern analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={handlePastPaperUpload} />
                  {pastPaperFile && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {pastPaperFile.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Analyze Button */}
            {(studyMaterialFile && pastPaperFile) && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="px-8"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Patterns...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Analyze & Generate Questions
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Analysis Results */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      Analysis Results
                    </span>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Generated {analysisResult.questions.length} questions based on past paper patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Analysis Summary */}
                  {analysisResult.analysis && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Pattern Analysis
                      </h4>
                      <p className="text-blue-700 text-sm">{analysisResult.analysis}</p>
                    </div>
                  )}
                  
                  {/* Generated Questions */}
                  {analysisResult.questions && analysisResult.questions.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Generated Questions ({analysisResult.questions.length})
                      </h4>
                      
                      <div className="space-y-4">
                        {analysisResult.questions.map((question, index) => (
                          <div key={index} className="border border-border rounded-lg overflow-hidden bg-white">
                            <button
                              className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                              onClick={() => toggleQuestion(index)}
                            >
                              <span className="font-medium flex items-start">
                                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-left">{question}</span>
                              </span>
                              {expandedQuestions[index] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                              )}
                            </button>
                            
                            {expandedQuestions[index] && analysisResult.answers && analysisResult.answers[index] && (
                              <div className="p-4 bg-green-50 border-t border-green-200">
                                <div className="flex items-start">
                                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                    A
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-green-700 mb-1">Answer:</p>
                                    <p className="text-green-800">{analysisResult.answers[index]}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Questions;