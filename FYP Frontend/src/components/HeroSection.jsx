import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Shield, Clock, Award, Users, 
  CheckCircle, Sparkles, Brain, FileText, 
  Lightbulb, BookOpen, Star, MessageCircle,
  GraduationCap, Zap, Settings, BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const features = [
    { icon: <Brain className="h-5 w-5 text-primary" />, text: "AI-Powered Learning" },
    { icon: <FileText className="h-5 w-5 text-primary" />, text: "Smart Summaries" },
    { icon: <Lightbulb className="h-5 w-5 text-primary" />, text: "Exam Prep" },
    { icon: <CheckCircle className="h-5 w-5 text-primary" />, text: "Proven Results" }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.5 }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.5 }}
          className="absolute top-1/2 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.5 }}
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
        ></motion.div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.03]"></div>
      
      <div className="container relative mx-auto px-4 z-10">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Feature badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-8 shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GraduationCap className="h-3.5 w-3.5 mr-2 text-primary" />
            <span className="flex items-center text-sm font-medium text-primary">
              Next-Generation Learning Platform
            </span>
          </motion.div>
          
          {/* Main heading with clear value proposition */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground max-w-4xl mx-auto"
            variants={fadeIn}
          >
            AI Study Assistant for <br/>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient pb-1">Exam Success</span>
          </motion.h1>
          
          {/* Clear explanation subheading */}
          <motion.p 
            className="text-xl mb-12 text-muted-foreground max-w-3xl mx-auto"
            variants={fadeIn}
          >
            Upload PDFs, YouTube videos, or documents and get instant AI-generated summaries, practice questions, and translations. Study smarter, not harder.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" variants={fadeIn}>
            <Button size="lg" className="relative overflow-hidden group shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <Link to="/dashboard" className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm hover:bg-background/90 border-primary/20 hover:border-primary/40 transition-all duration-300">
              <Link to="/dashboard" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Explore Features
              </Link>
            </Button>
          </motion.div>
          
          {/* Key Value Propositions - Horizontal Cards */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {/* AI Learning Card */}
            <motion.div 
              className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">AI-Powered Learning</h3>
              <p className="text-sm text-foreground/80">
                Transform any content into digestible summaries and practice questions in seconds.
              </p>
            </motion.div>
            
            {/* Time Saving Card */}
            <motion.div 
              className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Save 80% Study Time</h3>
              <p className="text-sm text-foreground/80">
                Skip tedious reading. Get straight to key concepts and practice questions.
              </p>
            </motion.div>
            
            {/* Multi-format Card */}
            <motion.div 
              className="bg-card/90 backdrop-blur-sm border border-border/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Any Format, Any Language</h3>
              <p className="text-sm text-foreground/80">
                Upload any format or paste YouTube links. Get translations instantly.
              </p>
            </motion.div>
            
            {/* Results guarantee */}
            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 shadow-lg hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Proven Results</h3>
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-primary mr-2">98%</span>
                <span className="text-sm text-foreground/80">success rate</span>
              </div>
              <p className="text-sm text-foreground/80">
                Students report improved grades within the first week.
              </p>
            </motion.div>
          </motion.div>
          
          {/* Feature highlights - Horizontal layout */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/20 transition-all shadow-sm hover:shadow-md"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { delay: 0.9 + (index * 0.1) } 
                  }
                }}
              >
                <div className="mr-3">{feature.icon}</div>
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;