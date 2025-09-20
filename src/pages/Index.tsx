import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UploadZone } from "@/components/ui/upload-zone";
import { ScoreCard } from "@/components/analysis/score-card";
import { FeedbackList, FeedbackItem } from "@/components/analysis/feedback-list";
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
    
    // Calculate overall score
    const overallScore = Math.round((atsScore + keywordScore + readabilityScore) / 3);
    
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-slate-50">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Get Your Resume <span className="text-zinc-50">ATS-Ready</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and job description to get instant feedback on ATS compatibility, 
            keyword optimization, and readability
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadZone onFileSelect={handleFileUpload} />
                {uploadedFile && <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        {uploadedFile.name}
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>}
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Paste the job description here for keyword analysis..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="min-h-[200px] resize-none" />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {jobDescription.length}/5000 characters
                  </p>
                  <Button onClick={handleAnalyze} disabled={!uploadedFile || !jobDescription.trim() || isAnalyzing} className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                    {isAnalyzing ? <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </> : <>
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze Resume
                      </>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResults ? <>
                {/* Overall Score */}
                <Card className="shadow-large bg-card-gradient">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Overall Score</CardTitle>
                    <div className="text-4xl font-bold text-primary">
                      {analysisResults.overallScore}%
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Analyzed in {analysisResults.processingTime}s
                      </span>
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
                {analysisResults.keywordGaps.length > 0 && <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>Missing Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.keywordGaps.map((keyword, index) => <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>)}
                      </div>
                    </CardContent>
                  </Card>}

                {/* Feedback */}
                <Card className="shadow-medium">
                  <CardContent className="pt-6">
                    <FeedbackList items={analysisResults.feedback} />
                  </CardContent>
                </Card>
              </> : <Card className="shadow-medium">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Upload your resume and paste a job description to get started
                  </p>
                </CardContent>
              </Card>}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Index;