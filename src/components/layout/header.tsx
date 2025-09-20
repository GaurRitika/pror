import Logo from "@/assets/logo.png";
import { Brain, Sparkles, Code2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="relative border-b border-border/50 bg-gradient-to-r from-card/95 to-card/80 backdrop-blur-xl shadow-large">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-32 h-32 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative p-3 bg-gradient-to-br from-card to-card/80 rounded-xl border border-border/50 shadow-medium group-hover:shadow-glow transition-all duration-300">
                <div className="relative">
                  <img src={Logo} alt="Resume Reviewer" className="h-10 w-10 object-contain" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  ResumeAI
                </h1>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Pro
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium -mt-0.5">
                🚀 AI-Powered Resume Analysis
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 backdrop-blur-sm">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground">
                Smart Analysis Engine
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-medium">Built for Developers</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
