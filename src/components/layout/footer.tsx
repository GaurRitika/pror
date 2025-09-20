import { Linkedin, Github, Mail, Heart, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-card/90 to-card/70 border-t border-border/50 mt-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Brand and Social */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur-sm"></div>
                <div className="relative p-3 bg-gradient-to-br from-card to-card/80 rounded-xl border border-border/50 shadow-medium">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  ResumeAI Pro
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  AI-Powered Career Enhancement
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-md leading-relaxed">
              🚀 Transform your career with cutting-edge AI analysis. Get personalized feedback, 
              optimize for ATS systems, and land your dream developer job with confidence.
            </p>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-300 group"
              >
                <a href="https://www.linkedin.com/in/ritikagaur21/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-300 group"
              >
                <a href="https://github.com/GaurRitika/pror" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <Github className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-300 group"
              >
                <a href="mailto:devritika.gaur@gmail.com" aria-label="Send Email">
                  <Mail className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right Column - Features */}
          <div className="space-y-8">
            <h4 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                ✨ Features
              </span>
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">ATS Compatibility Analysis</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">Smart Keyword Optimization</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">Real-time Feedback</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">Developer-Focused Analysis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border/30 mt-12 pt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Made with</span>
            <Heart className="h-4 w-4 text-rose-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">for developers</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ResumeAI Pro. All rights reserved. 🚀 Empowering careers through AI.
          </p>
        </div>
      </div>
    </footer>
  );
};
