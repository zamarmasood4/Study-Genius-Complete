import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Youtube, FileText, Loader2, Play, Pause, Volume2, VolumeX, 
  Download, AlertCircle, CheckCircle
} from 'lucide-react';
import { apiService } from '@/services/api';

const Videos = () => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const [dubbingJob, setDubbingJob] = useState(null);
  const [isDubbing, setIsDubbing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const youtubeRef = useRef(null);
  const audioRef = useRef(null);

  const validateYoutubeUrl = (url) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/');
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setIsValid(value === '' || validateYoutubeUrl(value));
  };

  const extractVideoId = (url) => {
    let id = '';
    if (url.includes('youtube.com/watch')) {
      id = new URL(url).searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1].split('?')[0];
    }
    return id;
  };

  const handleLoadVideo = () => {
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a YouTube video URL",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateYoutubeUrl(url)) {
      setIsValid(false);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive"
      });
      return;
    }

    const id = extractVideoId(url);
    setVideoId(id);
    setDubbingJob(null);
    setIsPlaying(false);
    
    // Reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleDubVideo = async () => {
    if (!videoId) return;
    
    setIsDubbing(true);
    
    try {
      const response = await apiService.createDubbedVideo(url, "Urdu");
      
      if (response.success) {
        setDubbingJob({
          job_id: response.job_id,
          status: 'processing',
          progress: 0
        });
        
        // Start polling for status
        pollDubbingStatus(response.job_id);
        
        toast({
          title: "Dubbing Started",
          description: "Your video is being dubbed. This may take a few minutes.",
        });
      } else {
        throw new Error(response.message || "Dubbing failed to start");
      }
    } catch (error) {
      console.error("Error starting dubbing:", error);
      toast({
        title: "Dubbing Failed",
        description: error.message || "Failed to start dubbing process",
        variant: "destructive"
      });
    } finally {
      setIsDubbing(false);
    }
  };

  const pollDubbingStatus = async (jobId) => {
    const checkStatus = async () => {
      try {
        const response = await apiService.getDubbingStatus(jobId);
        
        if (response.success) {
          setDubbingJob(prev => ({
            ...prev,
            status: response.status,
            progress: response.progress,
            audio_file: response.audio_file,
            download_url: response.download_url,
            error: response.error
          }));

          if (response.status === 'processing') {
            // Continue polling
            setTimeout(() => checkStatus(), 2000);
          } else if (response.status === 'completed') {
            toast({
              title: "Dubbing Complete!",
              description: "Your video has been dubbed successfully!",
            });
          } else if (response.status === 'error') {
            toast({
              title: "Dubbing Failed",
              description: response.error || "Dubbing process failed",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error checking dubbing status:", error);
        // If auth error, try to refresh token and continue polling
        if (error.message?.includes('Authentication') || error.message?.includes('token')) {
          console.log("Auth error, attempting to refresh token...");
          // Continue polling anyway - the audio file is already created
          setTimeout(() => checkStatus(), 2000);
        }
      }
    };

    checkStatus();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause both YouTube and audio
      if (youtubeRef.current) {
        youtubeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Play both YouTube (muted) and audio
      if (youtubeRef.current) {
        youtubeRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        youtubeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      
      if (audioRef.current && dubbingJob?.status === 'completed') {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
        });
      }
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (dubbingJob?.download_url) {
      window.open(`${apiService.API_BASE}${dubbingJob.download_url}`, '_blank');
    }
  };

  // Auto-play when dubbing completes
  useEffect(() => {
    if (dubbingJob?.status === 'completed' && !isPlaying) {
      // Auto-start playback when dubbing completes
      setTimeout(() => {
        handlePlayPause();
      }, 1000);
    }
  }, [dubbingJob?.status]);

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container py-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Video Dubbing
        </h1>
        <p className="text-muted-foreground mb-8">
          Dub YouTube videos with AI-generated Urdu audio
        </p>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Youtube className="h-5 w-5 mr-2 text-red-600" />
                  YouTube Video
                </CardTitle>
                <CardDescription>
                  {dubbingJob?.status === 'completed' 
                    ? "Playing with Urdu dubbed audio" 
                    : "Watch with original audio"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={handleUrlChange}
                      className={!isValid ? "border-red-500" : ""}
                    />
                    <Button onClick={handleLoadVideo}>Load Video</Button>
                  </div>
                  
                  {!isValid && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid YouTube URL
                    </p>
                  )}
                  
                  {videoId ? (
                    <div className="space-y-4">
                      {/* YouTube Player */}
                      <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                        <iframe
                          ref={youtubeRef}
                          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`}
                          title="YouTube video player"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        
                        {dubbingJob?.status === 'completed' && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                            🔊 Urdu Dubbed
                          </div>
                        )}
                      </div>
                      
                      {/* Controls */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={handlePlayPause}
                          disabled={dubbingJob?.status !== 'completed'}
                          className="flex-1"
                          variant={dubbingJob?.status === 'completed' ? "default" : "outline"}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Urdu Audio
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              {dubbingJob?.status === 'completed' ? 'Play Urdu Audio' : 'Dub Video First'}
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          onClick={handleDubVideo} 
                          disabled={isDubbing || dubbingJob?.status === 'processing'}
                          variant="outline"
                        >
                          {isDubbing || dubbingJob?.status === 'processing' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={handleDubVideo} 
                        disabled={isDubbing || dubbingJob?.status === 'processing'}
                        className="w-full"
                      >
                        {isDubbing || dubbingJob?.status === 'processing' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dubbingJob?.status === 'processing' ? `Dubbing... ${dubbingJob.progress}%` : 'Starting...'}
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Dub Video to Urdu
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Youtube className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Enter a YouTube URL to load a video</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Dubbing Status */}
            <Card>
              <CardHeader>
                <CardTitle>Dubbing Status</CardTitle>
                <CardDescription>
                  Track your dubbing progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dubbingJob ? (
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg border ${
                      dubbingJob.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : dubbingJob.status === 'error'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center">
                        {dubbingJob.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : dubbingJob.status === 'error' ? (
                          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        ) : (
                          <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                        )}
                        <span className="font-medium capitalize">
                          {dubbingJob.status === 'processing' ? 'Processing...' : dubbingJob.status}
                        </span>
                      </div>
                      
                      {dubbingJob.status === 'processing' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${dubbingJob.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{dubbingJob.progress}% complete</p>
                        </div>
                      )}
                      
                      {dubbingJob.error && (
                        <p className="text-sm text-red-600 mt-2">{dubbingJob.error}</p>
                      )}
                    </div>

                    {dubbingJob.status === 'completed' && (
                      <div className="space-y-2">
                        <Button 
                          onClick={handleDownload}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Urdu Audio
                        </Button>
                        <p className="text-xs text-green-600 text-center">
                          ✅ Video will auto-play with Urdu audio
                        </p>
                      </div>
                    )}

                    {/* Hidden audio element */}
                    {dubbingJob?.status === 'completed' && dubbingJob.download_url && (
                      <audio
                        ref={audioRef}
                        src={`${apiService.API_BASE}${dubbingJob.download_url}`}
                        onEnded={() => {
                          setIsPlaying(false);
                          if (youtubeRef.current) {
                            youtubeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                          }
                        }}
                        onError={(e) => {
                          console.error("Audio error:", e);
                          toast({
                            title: "Audio Error",
                            description: "Failed to load dubbed audio",
                            variant: "destructive"
                          });
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Load a video and click "Dub Video to Urdu"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>1. Load YouTube video</p>
                <p>2. Click "Dub Video to Urdu"</p>
                <p>3. Wait for processing (2-5 minutes)</p>
                <p>4. Video auto-plays with Urdu audio</p>
                <p className="text-green-600 text-xs mt-2">
                  ✅ YouTube video mutes automatically
                </p>
                <p className="text-green-600 text-xs">
                  ✅ Urdu audio syncs with video
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;