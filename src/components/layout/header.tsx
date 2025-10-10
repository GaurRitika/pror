import Logo from "@/assets/logo.png";
import { Brain, Sparkles, Code2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="relative border-b border-border/30 bg-gradient-to-r from-card/90 to-card-secondary/80 backdrop-blur-xl shadow-large particles-bg">
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute top-0 right-1/3 w-24 h-24 bg-secondary/8 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
              <div className="relative p-3 bg-gradient-card rounded-xl border border-border-accent shadow-medium hover:shadow-glow transition-all duration-300 hover-scale">
                <div className="relative">
                  <img src={Logo} alt="Resume Reviewer" className="h-8 w-8 object-contain" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-primary rounded-full animate-subtle-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent">
                  ResumeAI
                </h1>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/15 rounded-full border border-primary/30">
                  <Sparkles className="h-3 w-3 text-primary animate-subtle-pulse" />
                  <span className="text-xs font-bold text-primary">
                    Pro
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium -mt-0.5">
                AI-Powered Resume Analysis
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-subtle rounded-full border border-border-accent backdrop-blur-sm hover-glow transition-all duration-300">
              <Brain className="h-4 w-4 text-primary animate-subtle-pulse" />
              <span className="text-sm font-semibold text-foreground">
                Smart Analysis Engine
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-medium">Built for Developers</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
