import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Download,
  Star,
  Target,
  TrendingUp,
  Shield,
  Rocket
} from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for processing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const premiumFeatures = [
    {
      icon: <Target className="h-5 w-5 text-emerald-400" />,
      title: "Advanced ATS Analysis",
      description: "Complete 100% analysis with 50+ compatibility factors"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
      title: "Industry Keywords",
      description: "Tailored keyword suggestions for your tech stack"
    },
    {
      icon: <Shield className="h-5 w-5 text-purple-400" />,
      title: "Salary Optimization",
      description: "Maximize earning potential with proven strategies"
    },
    {
      icon: <Rocket className="h-5 w-5 text-orange-400" />,
      title: "Interview Prep",
      description: "Personalized questions and preparation guide"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-subtle-gradient flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="py-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Your Payment...</h3>
            <p className="text-muted-foreground">Please wait while we confirm your premium upgrade.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subtle-gradient">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Success Hero */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-full flex items-center justify-center border border-emerald-400/30 backdrop-blur-sm">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎉 Welcome to{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Premium!
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Your payment was successful! You now have access to advanced resume analysis features.
          </p>
          
          {sessionId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="text-sm text-emerald-400 font-medium">
                Session ID: {sessionId.slice(-8)}
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Premium Features Unlocked */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl">
                  <Crown className="h-6 w-6 text-emerald-400" />
                </div>
                <span>Premium Features Unlocked</span>
              </CardTitle>
              <p className="text-muted-foreground">
                You now have access to all advanced analysis features
              </p>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              {premiumFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm rounded-lg border border-border/30"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards"
                  }}
                >
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-400 mt-1" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <span>What's Next?</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Get the most out of your premium subscription
              </p>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Re-analyze Your Resume</h4>
                    <p className="text-sm text-muted-foreground">Get your complete 100% analysis now</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                    <span className="text-secondary font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Download Premium Report</h4>
                    <p className="text-sm text-muted-foreground">Get detailed PDF analysis report</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Apply Premium Tips</h4>
                    <p className="text-sm text-muted-foreground">Implement salary optimization strategies</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button asChild className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start Premium Analysis
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Premium Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Premium Badge */}
        <div className="text-center mt-12">
          <Badge className="bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 px-6 py-2 text-lg">
            <Crown className="h-5 w-5 mr-2" />
            Premium Member
            <Star className="h-5 w-5 ml-2" />
          </Badge>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;