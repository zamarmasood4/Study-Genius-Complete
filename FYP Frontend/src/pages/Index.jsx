import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  FileText, Youtube, Languages, Brain, Book, FastForward, 
  BookOpen, Check, ChevronRight, Users, BarChart, Zap,
  Sparkles, Star, Award, PenTool, MessageCircle, Database,
  Layers, Code, Shield, Cpu, Globe, Lightbulb, Clock, 
  Briefcase, GraduationCap, Infinity, ArrowRight, CheckCircle2
} from 'lucide-react';
import WelcomeModal from '@/components/WelcomeModal';
import HeroSection from '@/components/HeroSection';

const FeatureCard = ({ icon, title, description }) => (
  <div className="enhanced-card p-6 flex flex-col items-start transition-all hover:translate-y-[-5px] hover:shadow-feature">
    <div className="feature-icon">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const BenefitItem = ({ children }) => (
  <div className="flex items-start space-x-3 mb-4">
    <div className="shrink-0 mt-0.5">
      <CheckCircle2 className="h-5 w-5 text-primary" />
    </div>
    <p className="text-foreground/90">{children}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="glass-card p-6 rounded-xl hover-scale">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl mr-4">
        {avatar || name.charAt(0)}
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
    <p className="text-foreground/80 italic">{content}</p>
    <div className="flex mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  </div>
);

const StatItem = ({ icon, value, label }) => (
  <div className="text-center p-6 transform transition-all hover:scale-105 duration-300">
    <div className="text-primary mb-3 flex justify-center">
      <div className="bg-primary/10 dark:bg-primary/15 rounded-full p-3">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-foreground mb-1 gradient-text">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const IntegrationItem = ({ icon, name }) => (
  <div className="glass-card rounded-lg flex flex-col items-center justify-center text-center p-6 h-full transition-all hover:scale-105 hover:shadow-lg">
    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary mb-3">
      {icon}
    </div>
    <h4 className="font-medium text-foreground">{name}</h4>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <WelcomeModal />
      
      {/* Hero Section - Moved to a separate component */}
      <HeroSection />

      {/* Stats Section - Enhanced */}
      <section className="py-16 bg-muted/30 dark:bg-background border-y border-border/30">
        <div className="app-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem 
              icon={<Users size={28} />} 
              value="10,000+" 
              label="Active Users" 
            />
            <StatItem 
              icon={<FileText size={28} />} 
              value="500,000+" 
              label="Documents Summarized" 
            />
            <StatItem 
              icon={<Youtube size={28} />} 
              value="250,000+" 
              label="Videos Analyzed" 
            />
            <StatItem 
              icon={<BarChart size={28} />} 
              value="98%" 
              label="Satisfaction Rate" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background relative overflow-hidden">
        <div className="app-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">
              <Sparkles className="h-4 w-4 inline mr-2" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Study Tools Powered by AI</h2>
            <p className="text-lg text-muted-foreground">
              Our platform offers a comprehensive suite of AI-powered tools designed to revolutionize your study experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText />}
              title="Document Summarization"
              description="Upload PDFs and documents to get instant AI-generated summaries and key points."
            />
            
            <FeatureCard 
              icon={<Brain />}
              title="Exam Question Generation"
              description="AI formulates potential exam questions based on your study materials."
            />
            
            <FeatureCard 
              icon={<Youtube />}
              title="YouTube Summarization"
              description="Extract key points from educational videos for quick review."
            />
            
            <FeatureCard 
              icon={<FastForward />}
              title="Real-Time Video Dubbing"
              description="Listen to YouTube videos in your preferred language with AI-generated dubbing."
            />
            
            <FeatureCard 
              icon={<Languages />}
              title="Multilingual Translation"
              description="Translate your notes and summaries into different languages instantly."
            />
            
            <FeatureCard 
              icon={<Book />}
              title="Exam Answer Generator"
              description="Upload exam papers and get relevant AI-generated answers."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10 border-y border-border/30">
        <div className="app-container">
          <h2 className="section-title text-foreground">How StudyGenius Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-9 top-10 bottom-10 w-1 bg-primary/20 dark:bg-primary/10 rounded-full"></div>
              
              <div className="flex items-start mb-12 relative">
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary z-10 shrink-0">
                  <PenTool size={32} />
                </div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">1. Upload Your Study Materials</h3>
                  <p className="text-muted-foreground">
                    Upload PDFs, documents, past papers, or provide YouTube video links. Our platform accepts various formats to accommodate different study needs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-12 relative">
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary z-10 shrink-0">
                  <Sparkles size={32} />
                </div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">2. AI Processing</h3>
                  <p className="text-muted-foreground">
                    Our sophisticated AI algorithms analyze your materials, identifying key concepts, extracting important information, and processing content based on your selected tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start relative">
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary z-10 shrink-0">
                  <Zap size={32} />
                </div>
                <div className="ml-8">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">3. Receive AI-Generated Results</h3>
                  <p className="text-muted-foreground">
                    Get comprehensive summaries, practice questions, translations, or video analyses. Save them to your account for future reference or export them in various formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="app-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">
              <Layers className="h-4 w-4 inline mr-2" />
              Seamless Integrations
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Works With Your Favorite Tools</h2>
            <p className="text-lg text-muted-foreground">
              StudyGenius integrates with the tools and platforms you already use, making it easy to incorporate into your study workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <IntegrationItem icon={<Globe size={24} />} name="Google Drive" />
            <IntegrationItem icon={<Database size={24} />} name="Dropbox" />
            <IntegrationItem icon={<Code size={24} />} name="Notion" />
            <IntegrationItem icon={<Layers size={24} />} name="Microsoft Office" />
            <IntegrationItem icon={<MessageCircle size={24} />} name="Slack" />
            <IntegrationItem icon={<Cpu size={24} />} name="Zoom" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30 dark:bg-muted/10 border-y border-border/30">
        <div className="app-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-tag">
                <CheckCircle2 className="h-4 w-4 inline mr-2" />
                Why Choose StudyGenius
              </div>
              <h2 className="text-3xl font-bold mb-8 text-foreground">Transforming How You Study</h2>
              <div className="space-y-4">
                <BenefitItem>Save hours of study time with AI-powered summaries</BenefitItem>
                <BenefitItem>Better exam preparation with targeted practice questions</BenefitItem>
                <BenefitItem>Overcome language barriers with instant translations</BenefitItem>
                <BenefitItem>Extract knowledge from videos without watching them entirely</BenefitItem>
                <BenefitItem>Organize all your study materials in one place</BenefitItem>
                <BenefitItem>Accessible anywhere, anytime on any device</BenefitItem>
              </div>
              <div className="mt-10">
                <Button asChild className="group btn-animated">
                  <Link to="/dashboard">
                    Try It Now
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="glass-card p-8 rounded-lg border border-border/50 shadow-card">
              <h3 className="text-2xl font-semibold mb-8 text-foreground">How It Works</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-foreground">Upload Content</h4>
                    <p className="text-muted-foreground">Upload your study materials or provide YouTube video links.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-foreground">AI Processing</h4>
                    <p className="text-muted-foreground">Our AI analyzes your content and generates summaries, questions, or translations.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-foreground">Study Smarter</h4>
                    <p className="text-muted-foreground">Review AI-generated materials, save time, and improve your learning efficiency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Fields Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="app-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">
              <GraduationCap className="h-4 w-4 inline mr-2" />
              For All Academic Fields
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Tailored for Every Subject</h2>
            <p className="text-lg text-muted-foreground">
              Whether you're studying science, humanities, languages, or professional courses, StudyGenius adapts to your educational needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-xl border border-border/50 hover:shadow-lg transition-all hover-scale">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary inline-block mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Sciences</h3>
              <p className="text-muted-foreground">
                Perfect for physics, chemistry, biology, and medicine. Break down complex concepts and visualize data.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl border border-border/50 hover:shadow-lg transition-all hover-scale">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary inline-block mb-4">
                <Book size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Humanities</h3>
              <p className="text-muted-foreground">
                Ideal for history, literature, philosophy, and social sciences. Analyze texts and extract key themes.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl border border-border/50 hover:shadow-lg transition-all hover-scale">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary inline-block mb-4">
                <Languages size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Languages</h3>
              <p className="text-muted-foreground">
                Master new languages with translation tools, vocabulary extraction, and pronunciation assistance.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl border border-border/50 hover:shadow-lg transition-all hover-scale">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary inline-block mb-4">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Professional</h3>
              <p className="text-muted-foreground">
                Support for business, law, engineering, and IT courses. Practice with real-world applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30 dark:bg-muted/10 border-y border-border/30">
        <div className="app-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="section-tag">
              <Star className="h-4 w-4 inline mr-2 fill-current" />
              User Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students who have transformed their study habits with StudyGenius.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson"
              role="Medical Student"
              content="StudyGenius has transformed how I prepare for exams. The document summarization feature alone saved me countless hours of study time!"
            />
            <TestimonialCard 
              name="David Chen"
              role="Engineering Student"
              content="The ability to extract key points from complex YouTube lectures is incredible. I can quickly review concepts before exams."
            />
            <TestimonialCard 
              name="Maria Rodriguez"
              role="Language Student"
              content="As a non-native English speaker, the translation features help me understand complex academic papers in my native language."
            />
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="app-container max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="section-tag">
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Find answers to the most common questions about StudyGenius.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-lg hover-scale">
              <h3 className="text-lg font-semibold mb-2 text-foreground">How accurate are the AI-generated summaries?</h3>
              <p className="text-muted-foreground">Our AI models are trained on vast educational datasets and achieve over 95% accuracy in extracting key information from documents and videos. However, we always recommend reviewing the generated content.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg hover-scale">
              <h3 className="text-lg font-semibold mb-2 text-foreground">What file formats can I upload?</h3>
              <p className="text-muted-foreground">StudyGenius supports PDF, DOCX, TXT, and RTF files for document summarization. For video summarization, you can provide YouTube URLs.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg hover-scale">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Is my data secure?</h3>
              <p className="text-muted-foreground">Yes, we take data security seriously. All uploads are encrypted, and we don't store your original documents after processing unless you explicitly save them to your account.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg hover-scale">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">Absolutely. You can cancel your subscription at any time. If you cancel, you'll continue to have access to the features until the end of your billing cycle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden bg-muted/30 dark:bg-muted/10 border-t border-border/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 dark:bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="app-container relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="section-tag animate-pulse">
              <Zap className="h-4 w-4 inline mr-2" />
              Get Started Today
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Transform Your Study Experience?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/80">
              Join thousands of students who are studying smarter, not harder with StudyGenius.
            </p>
            <Button size="lg" asChild className="group btn-animated">
              <Link to="/dashboard">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 border-t border-border">
        <div className="app-container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold gradient-text">StudyGenius</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
            </div>
          </div>
          
          <div className="border-t border-border/30 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} StudyGenius. All rights reserved.</p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="mr-4">Follow us:</span>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;