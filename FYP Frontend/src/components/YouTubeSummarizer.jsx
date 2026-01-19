import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, Youtube, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const YouTubeSummarizer = ({ onSummarize }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!videoUrl) {
      toast({
        title: "URL required",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }

    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress('Extracting transcript...');

    try {
      const response = await apiService.summarizeYouTube(videoUrl);
      
      if (response.success) {
        setProgress('Summary generated successfully!');
        
        toast({
          title: "Video Summarized",
          description: `Processed ${response.chunks_processed} chunk(s) in ${response.processing_time}s`,
        });

        if (onSummarize) {
          onSummarize({
            title: `YouTube Summary: ${videoUrl}`,
            summary: response.summary,
            source_type: 'youtube',
            transcript: response.full_transcript,
            chunks: response.chunks_processed,
            processing_time: response.processing_time
          });
        }
      }
    } catch (error) {
      console.error('Failed to summarize video:', error);
      setProgress('Error generating summary');
      
      toast({
        title: "Summarization failed",
        description: error.message || "Please check the URL and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="youtube-url" className="flex items-center">
          <Youtube className="h-4 w-4 mr-2 text-red-500" />
          YouTube Video URL
        </Label>
        <Input
          id="youtube-url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button 
        onClick={handleSummarize} 
        disabled={isLoading || !videoUrl}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Youtube className="h-4 w-4 mr-2" />
            Generate Summary
          </>
        )}
      </Button>

      {isLoading && progress && (
        <Alert>
          <Loader className="h-4 w-4 animate-spin" />
          <AlertDescription>{progress}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          Supports videos up to several hours long
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-blue-500" />
          Long videos are processed in 10-minute chunks
        </div>
        <div className="flex items-center">
          <AlertCircle className="h-3 w-3 mr-1 text-orange-500" />
          Transcript is cleaned (no timestamps or numbers)
        </div>
      </div>
    </div>
  );
};

export default YouTubeSummarizer;