import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

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
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
  info: "border-blue-200 bg-blue-50 text-blue-900", 
  success: "border-green-200 bg-green-50 text-green-900",
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

export const FeedbackList = ({ items, className }: FeedbackListProps) => {
  const sortedItems = [...items].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold mb-4">Actionable Feedback</h3>
      
      {sortedItems.map((item) => {
        const Icon = iconMap[item.type];
        
        return (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-lg border-l-4 transition-all duration-200",
              "hover:shadow-medium",
              colorMap[item.type]
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    item.priority === "high" && "bg-red-100 text-red-700",
                    item.priority === "medium" && "bg-yellow-100 text-yellow-700",
                    item.priority === "low" && "bg-blue-100 text-blue-700"
                  )}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
      
      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
          <p>Great! No critical issues found.</p>
        </div>
      )}
    </div>
  );
};