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
    border: "border-rose-500/50",
    bg: "bg-gradient-to-br from-rose-500/10 to-rose-600/5",
    text: "text-rose-100",
    icon: "text-rose-400",
    accent: "bg-rose-500/20"
  },
  warning: {
    border: "border-amber-500/50",
    bg: "bg-gradient-to-br from-amber-500/10 to-amber-600/5",
    text: "text-amber-100",
    icon: "text-amber-400",
    accent: "bg-amber-500/20"
  },
  info: {
    border: "border-blue-500/50",
    bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
    text: "text-blue-100",
    icon: "text-blue-400",
    accent: "bg-blue-500/20"
  },
  success: {
    border: "border-emerald-500/50",
    bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
    text: "text-emerald-100",
    icon: "text-emerald-400",
    accent: "bg-emerald-500/20"
  }
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

const priorityConfig = {
  high: { 
    label: "🔥 High Priority", 
    bg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    icon: Zap
  },
  medium: { 
    label: "⚡ Medium Priority", 
    bg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: Shield
  },
  low: { 
    label: "💡 Low Priority", 
    bg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: Star
  }
};

export const FeedbackList = ({ items, className }: FeedbackListProps) => {
  const sortedItems = [...items].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          💬 Actionable Feedback
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
              "group relative p-6 rounded-xl overflow-hidden",
              "backdrop-blur-sm border transition-all duration-500 transform",
              "hover:scale-[1.02] hover:shadow-glow",
              colors.border,
              colors.bg
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards"
            }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <div className="w-full h-full transform rotate-12">
                <Icon className="w-full h-full" />
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    colors.accent,
                    "group-hover:scale-110"
                  )}>
                    <Icon className={cn("h-6 w-6", colors.icon)} />
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-lg", colors.text)}>
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
              
              <p className={cn("text-sm leading-relaxed", colors.text, "opacity-90")}>
                {item.description}
              </p>
              
              {/* Action indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  item.type === "error" ? "bg-rose-400" :
                  item.type === "warning" ? "bg-amber-400" :
                  item.type === "info" ? "bg-blue-400" : "bg-emerald-400"
                )} />
                <span className="text-xs text-muted-foreground font-medium">
                  {item.type === "success" ? "✅ Great job!" : "📝 Action needed"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {items.length === 0 && (
        <div className="text-center py-16 relative">
          {/* Celebration background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-xl font-bold text-emerald-400 mb-2">🎉 Excellent Work!</h4>
            <p className="text-muted-foreground">Your resume looks great! No critical issues found.</p>
          </div>
        </div>
      )}
    </div>
  );
};