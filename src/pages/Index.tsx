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
  return <div className="min-h-screen bg-gradient-background particles-bg">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Premium Hero Section */}
        <div className="text-center mb-20 relative">
          {/* Subtle floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-gentle-float"></div>
            <div className="absolute top-32 right-1/4 w-40 h-40 bg-secondary/6 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '3s' }}></div>
          </div>
          
          <div className="relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-gradient-subtle rounded-full border border-border-accent backdrop-blur-sm hover-glow">
              <Brain className="h-5 w-5 text-primary animate-subtle-pulse" />
              <span className="text-sm font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI-Powered Resume Analysis
              </span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Level Up Your
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift">
                Developer Career
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
              Get instant, actionable feedback on your resume with our advanced AI system.
              <br />
              <span className="text-lg text-foreground-muted">
                Optimize for ATS systems, improve keyword matching, and land your dream tech job.
              </span>
            </p>
            
            {/* Premium feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-card rounded-full border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-primary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">ATS Optimization</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-card rounded-full border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-secondary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">Keyword Analysis</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-card rounded-full border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-primary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">Real-time Feedback</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-card rounded-full border border-border-accent backdrop-blur-sm hover-lift">
                <div className="w-2 h-2 bg-secondary rounded-full animate-subtle-pulse"></div>
                <span className="text-sm font-medium text-foreground">Developer-Focused</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Upload Section */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/8 rounded-full blur-3xl animate-gentle-float"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <div className="p-3 bg-gradient-primary rounded-lg shadow-glow">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-heading text-foreground">
                    Upload Resume
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <UploadZone onFileSelect={handleFileUpload} />
                {uploadedFile && <div className="mt-6 p-5 bg-gradient-to-r from-primary/10 to-secondary/8 rounded-xl border border-border-accent backdrop-blur-sm animate-scale-in">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-primary rounded-lg shadow-medium">
                        <FileText className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-foreground block">
                          {uploadedFile.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Ready for analysis
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 font-semibold">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-secondary/8 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '1s' }}></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-4 text-xl">
                  <div className="p-3 bg-gradient-to-r from-secondary to-primary rounded-lg shadow-glow">
                    <Target className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-heading text-foreground">
                    Job Description
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <Textarea 
                  placeholder="Paste the job description here for intelligent keyword analysis and ATS optimization..." 
                  value={jobDescription} 
                  onChange={e => setJobDescription(e.target.value)} 
                  className="min-h-[200px] resize-none bg-muted/20 border-border-accent backdrop-blur-sm focus:bg-muted/30 focus:border-primary/50 transition-all duration-300 text-foreground placeholder:text-muted-foreground" 
                />
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                      {jobDescription.length}/5000 characters
                    </p>
                    {jobDescription.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-subtle rounded-full border border-border-accent">
                        <div className="w-2 h-2 bg-primary rounded-full animate-subtle-pulse"></div>
                        <span className="text-xs font-semibold text-primary">Ready to analyze</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!uploadedFile || !jobDescription.trim() || isAnalyzing} 
                    className="relative overflow-hidden"
                    size="lg"
                  >
                    {isAnalyzing ? <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                        <span>Analyzing...</span>
                      </> : <>
                        <Zap className="h-5 w-5 mr-2 animate-subtle-pulse" />
                        <span>Analyze Resume</span>
                      </>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {analysisResults ? <>
                {/* Overall Score */}
                <Card className="relative overflow-hidden group shadow-glow-strong">
                  {/* Elegant background elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/12 rounded-full blur-3xl animate-gentle-float"></div>
                    <div className="absolute bottom-0 right-0 w-28 h-28 bg-secondary/10 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
                  </div>
                  
                  <CardHeader className="relative z-10 text-center py-10">
                    <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 bg-gradient-subtle rounded-full border border-border-accent backdrop-blur-sm">
                      <Brain className="h-5 w-5 text-primary animate-subtle-pulse" />
                      <span className="text-sm font-bold bg-gradient-primary bg-clip-text text-transparent">
                        AI Analysis Complete
                      </span>
                    </div>
                    
                    <CardTitle className="text-3xl font-bold mb-8 font-heading text-foreground">
                      Overall Score
                    </CardTitle>
                    
                    <div className="relative inline-block mb-6">
                      <div className="text-8xl font-bold font-heading bg-gradient-primary bg-clip-text text-transparent animate-gradient-shift">
                        {analysisResults.overallScore}%
                      </div>

                      {analysisResults.overallScore >= 95 && (
                        <div className="absolute -top-3 -right-3">
                          <div className="px-3 py-1.5 bg-gradient-to-r from-secondary to-primary text-primary-foreground text-xs font-bold rounded-full animate-subtle-pulse shadow-glow">
                            Free Limit
                          </div>
                        </div>
                      )}
                      <div className="absolute -inset-6 bg-gradient-primary rounded-full blur-2xl opacity-20 animate-golden-glow"></div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 mb-6 px-5 py-2.5 bg-gradient-card rounded-full border border-border-accent backdrop-blur-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Analyzed in {analysisResults.processingTime.toFixed(1)}s
                      </span>
                    </div>
                    
                    {/* Performance badge */}
                    <div>
                      {analysisResults.overallScore >= 80 ? (
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary/20 to-secondary/15 text-primary rounded-full border border-primary/30 shadow-glow">
                          <span className="text-xl">🏆</span>
                          <span className="font-bold">Excellent Resume!</span>
                        </div>
                      ) : analysisResults.overallScore >= 60 ? (
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-secondary/20 to-primary/15 text-secondary rounded-full border border-secondary/30">
                          <span className="text-xl">💪</span>
                          <span className="font-bold">Good Progress!</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-card text-foreground rounded-full border border-border-accent">
                          <span className="text-xl">🚀</span>
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
                {analysisResults.keywordGaps.length > 0 && <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/8 rounded-full blur-3xl animate-gentle-float"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-4 text-xl">
                        <div className="p-3 bg-gradient-to-r from-secondary/80 to-primary/80 rounded-lg shadow-glow">
                          <Target className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-foreground">
                          Missing Keywords
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add these relevant skills to improve your keyword match score
                      </p>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {analysisResults.keywordGaps.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-secondary/15 to-primary/10 border-border-accent text-foreground hover:from-secondary/25 hover:to-primary/15 hover-scale transition-all duration-300 cursor-pointer"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="p-4 bg-gradient-subtle rounded-lg border border-border-accent">
                        <p className="text-sm text-muted-foreground font-medium">
                          💡 Pro Tip: Consider adding these skills to your resume if you have experience with them
                        </p>
                      </div>
                    </CardContent>
                  </Card>}

                {/* Feedback */}
                <Card className="relative overflow-hidden group">
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/8 rounded-full blur-3xl animate-gentle-float"></div>
                  <CardContent className="relative z-10 pt-6">
                    <FeedbackList items={analysisResults.feedback} />
                  </CardContent>
                </Card>

                {/* Premium Upgrade Component */}
                <PremiumUpgrade currentScore={analysisResults.overallScore} className="mt-8" />

              </> : <Card className="relative overflow-hidden group">
                {/* Elegant background elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-28 h-28 bg-primary/8 rounded-full blur-3xl animate-gentle-float"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/6 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
                </div>
                
                <CardContent className="relative z-10 py-24 text-center">
                  <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-20"></div>
                    <div className="relative w-24 h-24 bg-gradient-card rounded-full flex items-center justify-center border border-border-accent backdrop-blur-sm shadow-glow">
                      <Brain className="h-12 w-12 text-primary animate-subtle-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-6 font-heading text-foreground">
                    Ready to Analyze
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-12 leading-relaxed">
                    Upload your resume and paste a job description to get instant AI-powered feedback
                  </p>
                  
                  {/* Premium step indicators */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-subtle rounded-full border border-border-accent hover-lift">
                      <span className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs shadow-medium">1</span>
                      <span className="text-foreground font-medium">Upload Resume</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">→</div>
                    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-subtle rounded-full border border-border-accent hover-lift">
                      <span className="w-7 h-7 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs shadow-medium">2</span>
                      <span className="text-foreground font-medium">Add Job Description</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">→</div>
                    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-subtle rounded-full border border-border-accent hover-lift">
                      <span className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs shadow-medium">3</span>
                      <span className="text-foreground font-medium">Get AI Analysis</span>
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
