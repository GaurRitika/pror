import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description: string;
  className?: string;
}

export const ScoreCard = ({ title, score, maxScore, description, className }: ScoreCardProps) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-yellow-600"; 
    return "text-red-600";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={cn(
      "p-6 rounded-lg bg-card-gradient border shadow-medium",
      "hover:shadow-large transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-card-foreground">{title}</h3>
        <span className={cn("text-lg font-bold", getScoreColor(percentage))}>
          {score}/{maxScore}
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="mb-3 h-2"
      />
      
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};