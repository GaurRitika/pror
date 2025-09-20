import vLogo from "@/assets/v-logo.png";

export const Header = () => {
  return (
    <header className="border-b bg-card-gradient shadow-subtle">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-lg shadow-medium border">
              <img src={vLogo} alt="V Logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">V</h1>
              <p className="text-sm text-muted-foreground -mt-1">Resume Reviewer</p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            AI-Powered Resume Analysis
          </div>
        </div>
      </div>
    </header>
  );
};