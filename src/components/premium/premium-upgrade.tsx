import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PaymentService } from "@/services/payment";
import { useState } from "react";
import { 
  Crown, 
  Zap, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Rocket,
  Loader2,
  CreditCard
} from "lucide-react";

interface PremiumUpgradeProps {
  currentScore: number;
  className?: string;
  userEmail?: string;
}

export const PremiumUpgrade = ({ currentScore, className, userEmail }: PremiumUpgradeProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const premiumFeatures = [
    {
      icon: <Target className="h-4 w-4" />,
      title: "Advanced ATS Analysis",
      description: "Deep scan for 50+ ATS compatibility factors"
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Industry-Specific Keywords",
      description: "Tailored keyword suggestions for your tech stack"
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Salary Optimization Tips",
      description: "Maximize your earning potential with proven strategies"
    },
    {
      icon: <Rocket className="h-4 w-4" />,
      title: "Interview Preparation",
      description: "Get ready with personalized interview questions"
    }
  ];

  const handleUpgrade = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      toast({
        title: "Redirecting to payment...",
        description: "Please wait while we set up your secure payment.",
      });

      // For demo purposes, we'll simulate the payment
      // In production, replace this with PaymentService.redirectToCheckout(userEmail)
      const result = await PaymentService.simulatePayment();
      
      if (result.success) {
        toast({
          title: "🎉 Payment Successful!",
          description: "Welcome to Premium! Your advanced analysis is now available.",
        });
        
        // In a real app, you'd redirect to success page or update the UI
        // window.location.href = '/premium-success';
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10",
      "border-2 border-gradient-to-r from-amber-500/30 to-rose-500/30",
      "shadow-2xl hover:shadow-amber-500/25 transition-all duration-500",
      "animate-pulse-slow",
      className
    )}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* Floating sparkles */}
        <div className="absolute top-6 left-6 animate-float">
          <Sparkles className="h-4 w-4 text-amber-400 opacity-60" />
        </div>
        <div className="absolute bottom-8 right-8 animate-float delay-1000">
          <Star className="h-3 w-3 text-rose-400 opacity-60" />
        </div>
      </div>

      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full blur-md animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-full border border-amber-400/30 backdrop-blur-sm">
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                🚀 Unlock Premium Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Get the complete picture of your resume
              </p>
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            Limited Time
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Current vs Premium Score */}
        <div className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm rounded-xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">{currentScore}%</div>
              <div className="text-xs text-muted-foreground">Current Analysis</div>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent animate-pulse">
                100%
              </div>
              <div className="text-xs text-amber-400 font-medium">Premium Analysis</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full border border-amber-400/30">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">
                Unlock {100 - currentScore}% more insights
              </span>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div>
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            What you'll get with Premium:
          </h4>
          
          <div className="grid gap-3">
            {premiumFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm rounded-lg border border-border/30 hover:border-amber-400/30 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards"
                }}
              >
                <div className="p-1.5 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-lg border border-amber-400/20">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{feature.description}</div>
                </div>
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold py-4 text-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Payment...</span>
                  <CreditCard className="h-5 w-5 animate-pulse" />
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 group-hover:animate-bounce" />
                  <span>Upgrade to Premium - Only $2</span>
                  <Zap className="h-5 w-5 group-hover:animate-pulse" />
                </>
              )}
            </div>
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Shimmer effect */}
            {!isProcessing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </Button>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="text-xs text-muted-foreground">
              🔒 Secure payment • Cancel anytime • Instant access
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};