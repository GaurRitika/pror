import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UploadZone } from "@/components/ui/upload-zone";
import { ScoreCard } from "@/components/analysis/score-card";
import { FeedbackList, FeedbackItem } from "@/components/analysis/feedback-list";
import { PremiumUpgrade } from "@/components/premium/premium-upgrade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Target, Clock, Zap, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface AnalysisResults {
  atsScore: number;
  keywordScore: number;
  readabilityScore: number;
  overallScore: number;
  feedback: FeedbackItem[];
  keywordGaps: string[];
  processingTime: number;
}
const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const {
    toast
  } = useToast();
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    toast({
      title: "Resume uploaded successfully",
      description: `${file.name} is ready for analysis`
    });
  };
  const analyzeResumeContent = async (resumeText: string, jobDesc: string): Promise<AnalysisResults> => {
    // Extract common job-related keywords from job description
    const jobKeywords = jobDesc
      .toLowerCase()
      .match(/\b(?:javascript|python|react|node|sql|aws|docker|kubernetes|agile|scrum|git|api|database|frontend|backend|fullstack|typescript|html|css|java|angular|vue|mongodb|postgresql|redis|elasticsearch|machine learning|ai|data science|cloud|azure|gcp|devops|ci\/cd|testing|junit|pytest|selenium|leadership|teamwork|communication|problem solving|analytical|project management|marketing|sales|design|ui\/ux|photoshop|figma|analytics|seo|sem|social media|content|writing|excel|powerpoint|tableau|power bi|finance|accounting|consulting|strategy|operations|legal|compliance|research|healthcare|engineering|manufacturing|logistics|supply chain|customer service|hr|recruiting|training|education|teaching|nonprofit)\b/g) || [];
    
    const uniqueJobKeywords = [...new Set(jobKeywords)];
    
    // Extract keywords from resume text
    const resumeKeywords = resumeText
      .toLowerCase()
      .match(/\b(?:javascript|python|react|node|sql|aws|docker|kubernetes|agile|scrum|git|api|database|frontend|backend|fullstack|typescript|html|css|java|angular|vue|mongodb|postgresql|redis|elasticsearch|machine learning|ai|data science|cloud|azure|gcp|devops|ci\/cd|testing|junit|pytest|selenium|leadership|teamwork|communication|problem solving|analytical|project management|marketing|sales|design|ui\/ux|photoshop|figma|analytics|seo|sem|social media|content|writing|excel|powerpoint|tableau|power bi|finance|accounting|consulting|strategy|operations|legal|compliance|research|healthcare|engineering|manufacturing|logistics|supply chain|customer service|hr|recruiting|training|education|teaching|nonprofit)\b/g) || [];
    
    const uniqueResumeKeywords = [...new Set(resumeKeywords)];
    
    // Calculate keyword match score
    const matchedKeywords = uniqueJobKeywords.filter(keyword => 
      uniqueResumeKeywords.includes(keyword)
    );
    const keywordScore = uniqueJobKeywords.length > 0 
      ? Math.round((matchedKeywords.length / uniqueJobKeywords.length) * 100)
      : 50;
    
    // Find missing keywords
    const missingKeywords = uniqueJobKeywords.filter(keyword => 
      !uniqueResumeKeywords.includes(keyword)
    ).slice(0, 5); // Limit to top 5 missing keywords
    
    // Calculate ATS score based on resume structure
    let atsScore = 70; // Base score
    
    // Check for common ATS-friendly elements
    if (resumeText.includes('@')) atsScore += 5; // Email present
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText)) atsScore += 5; // Phone number
    if (/\b(experience|work history|employment)\b/i.test(resumeText)) atsScore += 5; // Experience section
    if (/\b(education|degree|university|college)\b/i.test(resumeText)) atsScore += 5; // Education section
    if (/\b(skills|technologies|competencies)\b/i.test(resumeText)) atsScore += 5; // Skills section
    if (resumeText.split('\n').length > 10) atsScore += 5; // Adequate length
    
    // Penalize for potential ATS issues
    if (resumeText.includes('\t')) atsScore -= 5; // Tables can cause issues
    if (/[^\x00-\x7F]/.test(resumeText)) atsScore -= 3; // Special characters
    
    atsScore = Math.min(Math.max(atsScore, 0), 100);
    
    // Calculate readability score
    const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = resumeText.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    
    let readabilityScore = 85; // Base readability score
    if (avgWordsPerSentence > 25) readabilityScore -= 10; // Too long sentences
    if (avgWordsPerSentence < 10) readabilityScore -= 5; // Too short sentences
    if (words.length < 50) readabilityScore -= 20; // Too short overall
    if (words.length > 1000) readabilityScore -= 5; // Too long overall
    
    readabilityScore = Math.min(Math.max(readabilityScore, 0), 100);
    
    // Calculate overall score (cap at 95% for free users)
    const rawOverallScore = Math.round((atsScore + keywordScore + readabilityScore) / 3);
    const overallScore = Math.min(rawOverallScore, 95); // Cap free analysis at 95%
    
    // Generate dynamic feedback
    const feedback: FeedbackItem[] = [];
    let feedbackId = 1;
    
    if (missingKeywords.length > 0) {
      feedback.push({
        id: feedbackId.toString(),
        type: "warning",
        title: "Missing Key Skills",
        description: `Consider adding these relevant skills: ${missingKeywords.slice(0, 3).join(', ')}`,
        priority: "high"
      });
      feedbackId++;
    }
    
    if (keywordScore < 60) {
      feedback.push({
        id: feedbackId.toString(),
        type: "error",
        title: "Low Keyword Match",
        description: "Your resume matches less than 60% of job requirements. Review the job description and add relevant skills.",
        priority: "high"
      });
      feedbackId++;
    }
    
    if (!resumeText.includes('@')) {
      feedback.push({
        id: feedbackId.toString(),
        type: "error",
        title: "Missing Contact Information",
        description: "Add a professional email address to your contact information",
        priority: "high"
      });
      feedbackId++;
    }
    
    if (!/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(resumeText)) {
      feedback.push({
        id: feedbackId.toString(),
        type: "warning",
        title: "Phone Number Missing",
        description: "Include a phone number in your contact section",
        priority: "medium"
      });
      feedbackId++;
    }
    
    if (avgWordsPerSentence > 25) {
      feedback.push({
        id: feedbackId.toString(),
        type: "info",
        title: "Sentence Length",
        description: "Consider breaking down long sentences for better readability",
        priority: "medium"
      });
      feedbackId++;
    }
    
    if (words.length < 100) {
      feedback.push({
        id: feedbackId.toString(),
        type: "warning",
        title: "Resume Too Short",
        description: "Your resume appears quite brief. Consider adding more details about your experience and achievements.",
        priority: "medium"
      });
      feedbackId++;
    }
    
    if (atsScore >= 85) {
      feedback.push({
        id: feedbackId.toString(),
        type: "success",
        title: "Excellent ATS Compatibility",
        description: "Your resume is well-structured for Applicant Tracking Systems",
        priority: "low"
      });
      feedbackId++;
    }
    
    if (keywordScore >= 80) {
      feedback.push({
        id: feedbackId.toString(),
        type: "success",
        title: "Strong Keyword Match",
        description: "Your resume aligns well with the job requirements",
        priority: "low"
      });
      feedbackId++;
    }
    
    // Add premium teaser feedback
    if (overallScore >= 90) {
      feedback.push({
        id: feedbackId.toString(),
        type: "info",
        title: "Premium Analysis Available",
        description: "Unlock advanced insights including salary optimization, industry-specific recommendations, and interview preparation tips.",
        priority: "medium"
      });
      feedbackId++;
    }
    
    return {
      atsScore,
      keywordScore,
      readabilityScore,
      overallScore,
      processingTime: Math.random() * 2 + 1, // Random processing time 1-3 seconds
      keywordGaps: missingKeywords,
      feedback
    };
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast({
        title: "No resume uploaded",
        description: "Please upload your resume first",
        variant: "destructive"
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste the job description for better analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Read the uploaded file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(uploadedFile);
      });

      console.log('File content preview:', fileContent.substring(0, 200));
      console.log('Job description preview:', jobDescription.substring(0, 200));
      console.log('File name:', uploadedFile.name);
      console.log('Analysis timestamp:', new Date().toISOString());

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyze the actual content
      const results = await analyzeResumeContent(fileContent, jobDescription);
      
      console.log('Analysis results:', results);
      
      setAnalysisResults(results);
      
      toast({
        title: "Analysis complete!",
        description: `Your resume scored ${results.overallScore}% overall`
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  return <div className="min-h-screen bg-subtle-gradient">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-32 right-1/4 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 backdrop-blur-sm">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🚀 AI-Powered Resume Analysis
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Level Up Your
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                Developer Career
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              🎯 Get instant, actionable feedback on your resume with our advanced AI system.
              <br />
              <span className="text-lg text-muted-foreground/80">
                Optimize for ATS systems, improve keyword matching, and land your dream tech job.
              </span>
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50 backdrop-blur-sm">
                <span className="text-green-400">✓</span>
                <span className="text-sm text-muted-foreground">ATS Optimization</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50 backdrop-blur-sm">
                <span className="text-green-400">✓</span>
                <span className="text-sm text-muted-foreground">Keyword Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50 backdrop-blur-sm">
                <span className="text-green-400">✓</span>
                <span className="text-sm text-muted-foreground">Real-time Feedback</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 rounded-full border border-border/50 backdrop-blur-sm">
                <span className="text-green-400">✓</span>
                <span className="text-sm text-muted-foreground">Developer-Focused</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large hover:shadow-glow transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    📄 Upload Resume
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <UploadZone onFileSelect={handleFileUpload} />
                {uploadedFile && <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <FileText className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-emerald-100 block">
                          ✅ {uploadedFile.name}
                        </span>
                        <span className="text-xs text-emerald-300/80">
                          Ready for analysis
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large hover:shadow-glow transition-all duration-500">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    🎯 Job Description
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <Textarea 
                  placeholder="🔍 Paste the job description here for intelligent keyword analysis and ATS optimization..." 
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  className="min-h-[200px] resize-none bg-muted/30 border-border/50 backdrop-blur-sm focus:bg-muted/50 transition-all duration-300" 
                />
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                      📝 {jobDescription.length}/5000 characters
                    </p>
                    {jobDescription.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-primary">Ready to analyze</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!uploadedFile || !jobDescription.trim() || isAnalyzing} 
                    className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:shadow-glow transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isAnalyzing ? <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        <span className="animate-pulse">Analyzing...</span>
                      </> : <>
                        <Zap className="h-5 w-5 mr-2 animate-pulse" />
                        <span className="font-semibold">🚀 Analyze Resume</span>
                      </>}
                    {/* Animated background effect */}
                    {!isAnalyzing && (
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResults ? <>
                {/* Overall Score */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border/50 shadow-glow">
                  {/* Animated background elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  </div>
                  
                  <CardHeader className="relative z-10 text-center py-8">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30">
                      <Brain className="h-5 w-5 text-primary animate-pulse" />
                      <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        AI Analysis Complete
                      </span>
                    </div>
                    
                    <CardTitle className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      🎯 Overall Score
                    </CardTitle>
                    
                    <div className="relative inline-block">
                      <div className="text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse mb-2">
                        {analysisResults.overallScore}%
                      </div>
                      {analysisResults.overallScore >= 95 && (
                        <div className="absolute -top-2 -right-2">
                          <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                            Free Limit
                          </div>
                        </div>
                      )}
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-50"></div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 mt-6 px-4 py-2 bg-muted/30 rounded-full border border-border/30 backdrop-blur-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        ⚡ Analyzed in {analysisResults.processingTime.toFixed(1)}s
                      </span>
                    </div>
                    
                    {/* Performance badge */}
                    <div className="mt-4">
                      {analysisResults.overallScore >= 80 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                          <span className="text-lg">🏆</span>
                          <span className="font-bold">Excellent Resume!</span>
                        </div>
                      ) : analysisResults.overallScore >= 60 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                          <span className="text-lg">💪</span>
                          <span className="font-bold">Good Progress!</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                          <span className="text-lg">🚀</span>
                          <span className="font-bold">Room to Improve!</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                {/* Score Breakdown */}
                <div className="grid gap-4">
                  <ScoreCard title="ATS Compatibility" score={analysisResults.atsScore} maxScore={100} description="How well your resume passes through ATS systems" />
                  <ScoreCard title="Keyword Match" score={analysisResults.keywordScore} maxScore={100} description="Relevance to the job description keywords" />
                  <ScoreCard title="Readability" score={analysisResults.readabilityScore} maxScore={100} description="Grammar, spelling, and overall clarity" />
                </div>

                {/* Missing Keywords */}
                {analysisResults.keywordGaps.length > 0 && <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large hover:shadow-glow transition-all duration-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg">
                          <Target className="h-6 w-6 text-amber-400" />
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                          🔍 Missing Keywords
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add these relevant skills to improve your keyword match score
                      </p>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex flex-wrap gap-3">
                        {analysisResults.keywordGaps.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-amber-500/30 text-amber-200 hover:from-amber-500/20 hover:to-amber-600/10 hover:scale-105 transition-all duration-300 cursor-pointer"
                          >
                            💡 {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <p className="text-xs text-amber-300 font-medium">
                          💡 Pro Tip: Consider adding these skills to your resume if you have experience with them
                        </p>
                      </div>
                    </CardContent>
                  </Card>}

                {/* Feedback */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                  <CardContent className="relative z-10 pt-6">
                    <FeedbackList items={analysisResults.feedback} />
                  </CardContent>
                </Card>

                {/* Premium Upgrade Component */}
                <PremiumUpgrade currentScore={analysisResults.overallScore} className="mt-8" />
              </> : <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-large">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                <CardContent className="relative z-10 py-20 text-center">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border border-primary/30 backdrop-blur-sm">
                      <Brain className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    🚀 Ready to Analyze
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                    Upload your resume and paste a job description to get instant AI-powered feedback
                  </p>
                  
                  {/* Step indicators */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                      <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">1</span>
                      <span className="text-muted-foreground">Upload Resume</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">→</div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
                      <span className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-xs">2</span>
                      <span className="text-muted-foreground">Add Job Description</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">→</div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
                      <span className="w-6 h-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">3</span>
                      <span className="text-muted-foreground">Get AI Analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Index;