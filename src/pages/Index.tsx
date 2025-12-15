import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ProcessingVisualization } from '@/components/ProcessingVisualization';
import { TextComparisonView } from '@/components/TextComparisonView';
import { ProjectDocumentation } from '@/components/ProjectDocumentation';
import { SimilarityMeter } from '@/components/SimilarityMeter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzePlagiarism, AlgorithmResult } from '@/utils/stringMatching';
import { extractTextFromFile } from '@/utils/fileParser';
import { toast } from 'sonner';
import { Search, Sparkles, FileText, Info, Gauge } from 'lucide-react';

const Index = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState<'kmp' | 'boyer-moore' | 'rabin-karp'>('kmp');
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [doc1Content, setDoc1Content] = useState<string>('');
  const [doc2Content, setDoc2Content] = useState<string>('');

  const handleAnalyze = async () => {
    if (!file1 || !file2) {
      toast.error('Please upload both documents');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    try {
      // Extract text from files (supports PDF, DOCX, TXT)
      const [text1, text2] = await Promise.all([
        extractTextFromFile(file1),
        extractTextFromFile(file2)
      ]);
      
      setDoc1Content(text1);
      setDoc2Content(text2);

      // Show processing animation for better UX
      await new Promise(resolve => setTimeout(resolve, 3000));

      const analysisResult = analyzePlagiarism(text1, text2, algorithm);
      setResult(analysisResult);
      
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Failed to analyze documents. Please ensure files are valid.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">PlagiarismCheck</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">DSA-powered document similarity analysis</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Advanced String Matching</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Detect Plagiarism with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Precision</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload PDF, Word, or text documents and analyze similarities using industry-standard DSA algorithms
          </p>
        </div>

        {/* Upload & Analysis Section */}
        <Card className="p-6 md:p-8 mb-8 shadow-lg">
          <div className="space-y-6 md:space-y-8">
            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              <FileUpload 
                file={file1} 
                onFileSelect={setFile1} 
                label="Document 1 (Source)" 
              />
              <FileUpload 
                file={file2} 
                onFileSelect={setFile2} 
                label="Document 2 (Target)" 
              />
            </div>

            {/* Algorithm Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Matching Algorithm
              </label>
              <Select 
                value={algorithm} 
                onValueChange={(value: 'kmp' | 'boyer-moore' | 'rabin-karp') => setAlgorithm(value)}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Choose algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kmp">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">KMP Algorithm</span>
                      <span className="text-xs text-muted-foreground">Knuth-Morris-Pratt</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="boyer-moore">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Boyer-Moore</span>
                      <span className="text-xs text-muted-foreground">Efficient preprocessing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rabin-karp">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Rabin-Karp</span>
                      <span className="text-xs text-muted-foreground">Hash-based matching</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!file1 || !file2 || isAnalyzing}
              className="w-full md:w-auto px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Analyze Documents
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Processing Visualization */}
        {isAnalyzing && !result && (
          <div className="animate-fade-in">
            <ProcessingVisualization />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Similarity Meter */}
            <SimilarityMeter 
              percentage={result.plagiarismPercentage} 
              algorithm={algorithm}
            />

            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Results</span>
                </TabsTrigger>
                <TabsTrigger value="meter" className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  <span className="hidden sm:inline">Meter</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="docs" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                <ResultsDisplay result={result} />
              </TabsContent>

              <TabsContent value="meter">
                <SimilarityMeter 
                  percentage={result.plagiarismPercentage} 
                  algorithm={algorithm}
                />
              </TabsContent>

              <TabsContent value="comparison">
                <TextComparisonView 
                  doc1={doc1Content} 
                  doc2={doc2Content} 
                  matches={result.matches} 
                />
              </TabsContent>

              <TabsContent value="docs">
                <ProjectDocumentation />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Info Section */}
        {!result && !isAnalyzing && (
          <Card className="p-6 md:p-8 bg-muted/30">
            <h3 className="text-xl font-semibold mb-4 text-foreground">How it works</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold text-foreground">Upload Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Upload PDF, Word, or text files you want to compare for similarity
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold text-foreground">Choose Algorithm</h4>
                <p className="text-sm text-muted-foreground">
                  Select from KMP, Boyer-Moore, or Rabin-Karp string matching algorithms
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold text-foreground">Get Results</h4>
                <p className="text-sm text-muted-foreground">
                  View detailed plagiarism percentage and matched segments instantly
                </p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
