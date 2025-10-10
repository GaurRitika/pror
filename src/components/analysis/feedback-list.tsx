import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, X, Zap, Shield, Lightbulb, Star } from "lucide-react";

export interface FeedbackItem {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface FeedbackListProps {
  items: FeedbackItem[];
  className?: string;
}

const iconMap = {
  error: X,
  warning: AlertTriangle,
  info: Lightbulb,
  success: CheckCircle,
};

const colorMap = {
  error: {
    border: "border-destructive/30",
    bg: "bg-gradient-to-br from-destructive/10 to-destructive/5",
    text: "text-foreground",
    icon: "text-destructive",
    accent: "bg-destructive/20"
  },
  warning: {
    border: "border-secondary/30",
    bg: "bg-gradient-to-br from-secondary/10 to-secondary/5",
    text: "text-foreground",
    icon: "text-secondary",
    accent: "bg-secondary/20"
  },
  info: {
    border: "border-primary/30",
    bg: "bg-gradient-to-br from-primary/10 to-primary/5",
    text: "text-foreground",
    icon: "text-primary",
    accent: "bg-primary/20"
  },
  success: {
    border: "border-primary/30",
    bg: "bg-gradient-to-br from-primary/10 to-secondary/5",
    text: "text-foreground",
    icon: "text-primary",
    accent: "bg-primary/20"
  }
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

const priorityConfig = {
  high: { 
    label: "High Priority", 
    bg: "bg-destructive/20 text-destructive border-destructive/30",
    icon: Zap
  },
  medium: { 
    label: "Medium Priority", 
    bg: "bg-secondary/20 text-secondary border-secondary/30",
    icon: Shield
  },
  low: { 
    label: "Low Priority", 
    bg: "bg-primary/20 text-primary border-primary/30",
    icon: Star
  }
};

export const FeedbackList = ({ items, className }: FeedbackListProps) => {
  const sortedItems = [...items].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
          <Lightbulb className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold font-heading text-foreground">
          Actionable Feedback
        </h3>
      </div>
      
      {sortedItems.map((item, index) => {
        const Icon = iconMap[item.type];
        const colors = colorMap[item.type];
        const priority = priorityConfig[item.priority];
        const PriorityIcon = priority.icon;
        
        return (
          <div
            key={item.id}
            className={cn(
              "group relative p-6 rounded-lg overflow-hidden",
              "bg-gradient-card backdrop-blur-sm border transition-all duration-300",
              "hover-lift hover:shadow-glow",
              colors.border
            )}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 animate-gentle-float">
              <div className="w-full h-full transform rotate-12">
                <Icon className="w-full h-full" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-300 shadow-medium border border-border-accent",
                    colors.accent,
                    "group-hover:shadow-glow"
                  )}>
                    <Icon className={cn("h-5 w-5", colors.icon)} />
                  </div>
                  <div>
                    <h4 className={cn("font-bold font-heading text-lg", colors.text)}>
                      {item.title}
                    </h4>
                  </div>
                </div>
                
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold",
                  priority.bg
                )}>
                  <PriorityIcon className="h-3 w-3" />
                  {priority.label}
                </div>
              </div>
              
              <p className={cn("text-sm leading-relaxed text-muted-foreground mb-4")}>
                {item.description}
              </p>
              
              {/* Action indicator */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-subtle-pulse",
                  item.type === "error" ? "bg-destructive" :
                  item.type === "warning" ? "bg-secondary" :
                  item.type === "info" ? "bg-primary" : "bg-primary"
                )} />
                <span className="text-sm text-foreground font-medium">
                  {item.type === "success" ? "Great job!" : "Action needed"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {items.length === 0 && (
        <div className="text-center py-20 relative">
          {/* Premium celebration background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-8">
            <div className="w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-gentle-float"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-full mb-8 shadow-glow">
              <CheckCircle className="h-12 w-12 text-primary-foreground animate-subtle-pulse" />
            </div>
            <h4 className="text-2xl font-bold font-heading text-primary mb-3">Excellent Work!</h4>
            <p className="text-muted-foreground text-lg">Your resume looks great! No critical issues found.</p>
          </div>
        </div>
      )}
    </div>
  );
};