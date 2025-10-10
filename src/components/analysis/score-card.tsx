import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target } from "lucide-react";
import { useState, useEffect } from "react";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description: string;
  className?: string;
}

export const ScoreCard = ({ title, score, maxScore, description, className }: ScoreCardProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = (score / maxScore) * 100;
  
  // Animate score counting up
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = score / 30; // Animate over 30 frames
      const animate = () => {
        start += increment;
        if (start < score) {
          setAnimatedScore(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setAnimatedScore(score);
        }
      };
      animate();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [score]);
  
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-primary";
    if (pct >= 60) return "text-secondary"; 
    return "text-destructive";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return "from-primary to-secondary";
    if (pct >= 60) return "from-secondary to-primary";
    return "from-destructive to-destructive/80";
  };

  const getIcon = (title: string) => {
    if (title.includes("ATS")) return <Target className="h-5 w-5" />;
    if (title.includes("Keyword")) return <TrendingUp className="h-5 w-5" />;
    return <Award className="h-5 w-5" />;
  };

  const getGradientBg = (pct: number) => {
    if (pct >= 80) return "from-primary/10 to-secondary/5";
    if (pct >= 60) return "from-secondary/10 to-primary/5";
    return "from-destructive/10 to-destructive/5";
  };

  return (
    <div className={cn(
      "group relative p-6 rounded-lg overflow-hidden",
      "bg-gradient-card backdrop-blur-sm",
      "border border-border-accent shadow-large",
      "hover-lift hover:shadow-glow transition-all duration-300",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity before:duration-300",
      `before:${getGradientBg(percentage)} hover:before:opacity-100`,
      className
    )}>
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5 animate-gentle-float">
        <div className="w-full h-full border border-primary/20 rounded-full transform rotate-12"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-2.5 rounded-lg transition-all duration-300 shadow-medium",
              "bg-gradient-subtle border border-border-accent",
              "group-hover:shadow-glow",
              getScoreColor(percentage)
            )}>
              {getIcon(title)}
            </div>
            <h3 className="font-bold font-heading text-foreground text-lg">{title}</h3>
          </div>
          <div className="text-right">
            <span className={cn("text-3xl font-bold font-heading tabular-nums", getScoreColor(percentage))}>
              {animatedScore}
            </span>
            <span className="text-sm text-muted-foreground font-medium">/{maxScore}</span>
          </div>
        </div>
        
        {/* Premium animated progress bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground font-medium">Progress</span>
            <span className={cn("text-sm font-bold", getScoreColor(percentage))}>
              {Math.round(percentage)}%
            </span>
          </div>
          <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden border border-border-accent/50">
            <div 
              className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                "bg-gradient-to-r", getProgressColor(percentage),
                "shadow-glow"
              )}
              style={{ 
                width: `${percentage}%`
              }}
            />
            {/* Elegant shimmer effect */}
            <div 
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
              style={{ 
                transform: `translateX(${percentage - 100}%)`,
                transition: "transform 1s ease-out"
              }}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        
        {/* Premium performance indicator */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-2 rounded-full animate-subtle-pulse",
            percentage >= 80 ? "bg-primary" : 
            percentage >= 60 ? "bg-secondary" : "bg-destructive"
          )} />
          <span className="text-sm font-medium text-foreground">
            {percentage >= 80 ? "Excellent" : 
             percentage >= 60 ? "Good" : "Needs Improvement"}
          </span>
        </div>
      </div>
    </div>
  );
};