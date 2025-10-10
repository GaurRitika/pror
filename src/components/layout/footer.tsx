import { Linkedin, Github, Mail, Heart, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-card border-t border-border/30 mt-24 overflow-hidden particles-bg">
      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-28 h-28 bg-primary/8 rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-secondary/6 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column - Brand and Social */}
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-sm opacity-30"></div>
                <div className="relative p-3 bg-gradient-card rounded-xl border border-border-accent shadow-medium hover:shadow-glow transition-all duration-300">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
                  ResumeAI Pro
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  AI-Powered Career Enhancement
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Transform your career with cutting-edge AI analysis. Get personalized feedback, 
              optimize for ATS systems, and land your dream developer job with confidence.
            </p>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-primary/10 hover:text-primary hover-scale transition-all duration-300 group"
              >
                <a href="https://www.linkedin.com/in/ritikagaur21/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-primary/10 hover:text-primary hover-scale transition-all duration-300 group"
              >
                <a href="https://github.com/GaurRitika/pror" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <Github className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-primary/10 hover:text-primary hover-scale transition-all duration-300 group"
              >
                <a href="mailto:devritika.gaur@gmail.com" aria-label="Send Email">
                  <Mail className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right Column - Features */}
          <div className="space-y-8">
            <h4 className="text-xl font-bold font-heading flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary animate-subtle-pulse" />
              <span className="text-foreground">
                Features
              </span>
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-subtle rounded-lg border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-primary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">ATS Compatibility Analysis</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-subtle rounded-lg border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-secondary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">Smart Keyword Optimization</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-subtle rounded-lg border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-primary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">Real-time Feedback</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-subtle rounded-lg border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-secondary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">Developer-Focused Analysis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border/20 mt-16 pt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">Made with</span>
            <Heart className="h-4 w-4 text-primary animate-subtle-pulse" />
            <span className="text-sm text-muted-foreground">for developers</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ResumeAI Pro. All rights reserved. Empowering careers through AI.
          </p>
        </div>
      </div>
    </footer>
  );
};
