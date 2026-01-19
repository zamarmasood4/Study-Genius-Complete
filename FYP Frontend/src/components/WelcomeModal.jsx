
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from 'lucide-react';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Show modal every time without checking localStorage
    setIsOpen(true);
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md glass-card animate-fade-in">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Welcome to StudyGenius!</DialogTitle>
          <DialogDescription className="text-center">
            Your AI-powered learning companion for academic excellence
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Experience the future of AI-powered study tools designed to enhance your learning journey.
          </p>
          <div className="flex items-center justify-center space-x-1 text-center text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Created by <span className="font-medium">M Janisar</span> and <span className="font-medium">Rao M Rafay</span></span>
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleClose} size="lg" className="w-full sm:w-auto group">
            Get Started
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="ml-1 group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
