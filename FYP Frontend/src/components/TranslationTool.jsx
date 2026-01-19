import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Check,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
];

const TranslationTool = ({ initialText = '' }) => {
  const [sourceText, setSourceText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to translate",
        variant: "destructive"
      });
      return;
    }
    
    if (sourceLanguage === targetLanguage) {
      toast({
        title: "Same language",
        description: "Source and target languages are the same",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would call the backend translation API
      // For now, we'll simulate a delay and generate a mock translation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This is just for demonstration - in a real app, this would be the result from a translation API
      const sourceLang = languages.find(l => l.code === sourceLanguage)?.name || 'Unknown';
      const targetLang = languages.find(l => l.code === targetLanguage)?.name || 'Unknown';
      
      setTranslatedText(
        `[This is a simulated translation from ${sourceLang} to ${targetLang}]\n\n` +
        sourceText
      );
      
      toast({
        title: "Translation complete",
        description: `Translated from ${sourceLang} to ${targetLang}`,
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "There was an error translating your text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    // Also swap the text if there's already a translation
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Translated text has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium flex items-center">
          <Languages className="h-5 w-5 mr-2 text-primary" />
          Translate Notes
        </h3>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Source Language</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapLanguages}
              className="rotate-90 md:rotate-0"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Target Language</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[200px] bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleTranslate}
            disabled={isLoading || !sourceText.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Translate
              </>
            )}
          </Button>
          
          {translatedText && (
            <Button 
              variant="outline" 
              onClick={handleCopy}
              disabled={isLoading}
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationTool;
