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
                <a href="https://www.linkedin.com/in/ritikagaur21/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href="https://github.com/GaurRitika/pror" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href="mailto:devritika.gaur@gmail.com" aria-label="Send Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          

        
        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 EdTech AI Resume Reviewer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
