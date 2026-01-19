import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  HelpCircle, 
  RefreshCw, 
  Download, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const QuestionGenerator = ({ summary, onGenerateQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Question types for demonstration
  const questionTypes = [
    { id: 'multiple_choice', label: 'Multiple Choice', isActive: true },
    { id: 'short_answer', label: 'Short Answer', isActive: true },
    { id: 'true_false', label: 'True/False', isActive: true },
    { id: 'essay', label: 'Essay/Long Form', isActive: false },
  ];

  const generateQuestions = async () => {
    if (!summary) {
      toast({
        title: "No summary available",
        description: "Please upload a document or video to generate questions",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would make an API call to the backend
      // For now, we'll simulate a delay and generate mock questions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock questions based on summary
      const mockQuestions = [
        {
          id: 1,
          type: 'multiple_choice',
          question: `Which of the following is a key point from "${summary.title}"?`,
          options: [
            { id: 'a', text: summary.keyPoints[0] || 'First point' },
            { id: 'b', text: 'An incorrect statement about the content' },
            { id: 'c', text: 'Another incorrect statement' },
            { id: 'd', text: 'A final incorrect option' },
          ],
          answer: 'a',
        },
        {
          id: 2,
          type: 'true_false',
          question: `True or False: ${summary.keyPoints[1] || 'Second key point'}`,
          answer: 'true',
        },
        {
          id: 3,
          type: 'short_answer',
          question: `Briefly explain: ${summary.keyPoints[2] || 'Third key point'}`,
          answer: 'This would be the expected answer based on the content.',
        },
        {
          id: 4,
          type: 'multiple_choice',
          question: 'Which concept is NOT discussed in the material?',
          options: [
            { id: 'a', text: summary.keyPoints[0] || 'First point' },
            { id: 'b', text: summary.keyPoints[1] || 'Second point' },
            { id: 'c', text: 'An unrelated concept not in the summary' },
            { id: 'd', text: summary.keyPoints[2] || 'Third point' },
          ],
          answer: 'c',
        },
        {
          id: 5,
          type: 'short_answer',
          question: `What are the main implications of ${summary.keyPoints[3] || 'the fourth point'}?`,
          answer: 'The expected answer would discuss implications based on content.',
        },
      ];
      
      setQuestions(mockQuestions);
      
      if (onGenerateQuestions) {
        onGenerateQuestions(mockQuestions);
      }
      
      toast({
        title: "Questions generated",
        description: `${mockQuestions.length} questions have been created based on the content.`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Failed to generate questions",
        description: "There was a problem creating questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (questions.length === 0) return;
    
    let content = `# Study Questions for: ${summary.title}\n\n`;
    
    questions.forEach((q, index) => {
      content += `## Question ${index + 1}: ${q.type.replace('_', ' ').toUpperCase()}\n`;
      content += `${q.question}\n\n`;
      
      if (q.type === 'multiple_choice' && q.options) {
        q.options.forEach(option => {
          content += `${option.id}) ${option.text}\n`;
        });
        content += `\nCorrect Answer: ${q.answer}\n\n`;
      } else if (q.type === 'true_false') {
        content += `Correct Answer: ${q.answer}\n\n`;
      } else if (q.type === 'short_answer') {
        content += `Sample Answer: ${q.answer}\n\n`;
      }
    });
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${summary.title.replace(/\s+/g, '_')}_questions.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Questions downloaded",
      description: "Your questions have been downloaded as a text file",
    });
  };

  const renderQuestion = (question) => {
    switch(question.type) {
      case 'multiple_choice':
        return (
          <div>
            <p className="font-medium mb-2">{question.question}</p>
            <div className="space-y-2 ml-4">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    option.id === question.answer 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {option.id}
                  </div>
                  <p className={option.id === question.answer ? 'text-green-700' : 'text-gray-700'}>
                    {option.text}
                    {option.id === question.answer && (
                      <CheckCircle className="h-4 w-4 inline ml-1 text-green-600" />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'true_false':
        return (
          <div>
            <p className="font-medium mb-2">{question.question}</p>
            <div className="flex space-x-4 ml-4">
              <div className={`px-3 py-1 rounded-full text-sm ${
                question.answer === 'true' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                True {question.answer === 'true' && <CheckCircle className="h-3 w-3 inline ml-1" />}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                question.answer === 'false' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                False {question.answer === 'false' && <CheckCircle className="h-3 w-3 inline ml-1" />}
              </div>
            </div>
          </div>
        );
        
      case 'short_answer':
        return (
          <div>
            <p className="font-medium mb-2">{question.question}</p>
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-gray-700 italic">{question.answer}</p>
            </div>
          </div>
        );
        
      default:
        return <p>{question.question}</p>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
            Exam Question Generator
          </CardTitle>
          <CardDescription>
            Generate study questions based on your material to test your knowledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {questionTypes.map(type => (
              <div 
                key={type.id}
                className={`px-3 py-1 text-sm rounded-full ${
                  type.isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {type.label}
              </div>
            ))}
          </div>
          
          <Button 
            onClick={generateQuestions}
            disabled={isLoading || !summary}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Study Questions</CardTitle>
            <CardDescription>
              {questions.length} questions generated for {summary.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="p-4 border rounded-md">
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download All Questions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default QuestionGenerator;
