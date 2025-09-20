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
    if (pct >= 80) return "text-emerald-400";
    if (pct >= 60) return "text-amber-400"; 
    return "text-rose-400";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return "from-emerald-500 to-emerald-600";
    if (pct >= 60) return "from-amber-500 to-amber-600";
    return "from-rose-500 to-rose-600";
  };

  const getIcon = (title: string) => {
    if (title.includes("ATS")) return <Target className="h-5 w-5" />;
    if (title.includes("Keyword")) return <TrendingUp className="h-5 w-5" />;
    return <Award className="h-5 w-5" />;
  };

  const getGradientBg = (pct: number) => {
    if (pct >= 80) return "from-emerald-500/10 to-emerald-600/5";
    if (pct >= 60) return "from-amber-500/10 to-amber-600/5";
    return "from-rose-500/10 to-rose-600/5";
  };

  return (
    <div className={cn(
      "group relative p-6 rounded-xl overflow-hidden",
      "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
      "border border-border/50 shadow-medium",
      "hover:shadow-glow hover:scale-[1.02] transition-all duration-500",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:transition-opacity before:duration-300",
      `before:${getGradientBg(percentage)} hover:before:opacity-100`,
      className
    )}>
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <div className="w-full h-full border border-primary/20 rounded-full transform rotate-12"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-all duration-300",
              "bg-gradient-to-br from-primary/20 to-secondary/20",
              "group-hover:from-primary/30 group-hover:to-secondary/30",
              getScoreColor(percentage)
            )}>
              {getIcon(title)}
            </div>
            <h3 className="font-bold text-card-foreground text-lg">{title}</h3>
          </div>
          <div className="text-right">
            <span className={cn("text-2xl font-bold tabular-nums", getScoreColor(percentage))}>
              {animatedScore}
            </span>
            <span className="text-sm text-muted-foreground">/{maxScore}</span>
          </div>
        </div>
        
        {/* Custom animated progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-medium">Progress</span>
            <span className={cn("text-xs font-bold", getScoreColor(percentage))}>
              {Math.round(percentage)}%
            </span>
          </div>
          <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                "bg-gradient-to-r", getProgressColor(percentage),
                "shadow-sm"
              )}
              style={{ 
                width: `${percentage}%`,
                boxShadow: percentage >= 80 ? "0 0 10px rgb(16 185 129 / 0.5)" : 
                          percentage >= 60 ? "0 0 10px rgb(245 158 11 / 0.5)" : 
                          "0 0 10px rgb(244 63 94 / 0.5)"
              }}
            />
            {/* Animated shimmer effect */}
            <div 
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{ 
                transform: `translateX(${percentage - 100}%)`,
                transition: "transform 1s ease-out"
              }}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        
        {/* Performance indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            percentage >= 80 ? "bg-emerald-400" : 
            percentage >= 60 ? "bg-amber-400" : "bg-rose-400"
          )} />
          <span className="text-xs font-medium text-muted-foreground">
            {percentage >= 80 ? "Excellent" : 
             percentage >= 60 ? "Good" : "Needs Improvement"}
          </span>
        </div>
      </div>
    </div>
  );
};