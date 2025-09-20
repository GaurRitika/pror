import { Linkedin, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Footer = () => {
  return <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Brand and Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              
              
            </div>
            
            <p className="text-muted-foreground max-w-md">
              Master your resume optimization with AI-powered analysis.
              Get personalized feedback and land your dream job with confidence.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href="https://www.linkedin.com/in/vizz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href="https://github.com/Vizz27" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href="mailto:vishwanath27ramnath@gmail.com" aria-label="Send Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right Column - Other Projects */}
          <div className="md:text-right">
            <h3 className="text-lg font-semibold mb-4">Other Projects</h3>
            <div className="space-y-2">
              
              <a href="https://v-ai-powered-interview-simulator.vercel.app/" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">V The AI Interview Simulator</a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 V AI Resume Reviewer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};