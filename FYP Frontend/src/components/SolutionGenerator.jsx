import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Loader2, Upload, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";

const SolutionGenerator = ({ document }) => {
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateSolution = async () => {
    if (!file && !document) {
      toast({
        title: "No document available",
        description: "Please upload a document first or use one from your summaries",
        variant: "destructive"
      });
      return;
    }

    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question to generate a solution",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - in a real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSolution = `Here is a solution for your question based on the uploaded document:

1. First, we identify the key concepts in the problem
2. Next, we apply the relevant formulas or methodologies
3. Then, we work through the step-by-step solution
4. Finally, we verify our answer is consistent with what we know

This solution addresses your specific question about "${question}" with reference to the document ${document?.title || file?.name}.`;
      
      setSolution(mockSolution);
      
      toast({
        title: "Solution generated",
        description: "Your solution has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating solution:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your solution. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Generate Solution</h3>
      </div>
      
      {!document && !file && (
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <Input
            type="file"
            className="hidden"
            id="solution-file-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('solution-file-upload').click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          {file && <p className="mt-2 text-sm">{file.name}</p>}
        </div>
      )}
      
      {(document || file) && (
        <div className="text-sm p-2 bg-muted rounded-md">
          <span className="font-medium">Active document:</span> {document?.title || file?.name}
        </div>
      )}
      
      <div>
        <label htmlFor="question" className="block text-sm font-medium mb-1">
          Enter your question
        </label>
        <Textarea
          id="question"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <Button
        className="w-full"
        onClick={handleGenerateSolution}
        disabled={isLoading || (!document && !file) || !question.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Generate Solution
          </>
        )}
      </Button>
      
      {solution && (
        <div className="border rounded-md p-4 bg-muted/50">
          <h4 className="font-medium mb-2 flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Solution
          </h4>
          <div className="whitespace-pre-line text-sm">{solution}</div>
        </div>
      )}
    </div>
  );
};

export default SolutionGenerator;
