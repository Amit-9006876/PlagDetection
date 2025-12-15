import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Palette, Zap, FileCode, GitBranch } from 'lucide-react';

export function ProjectDocumentation() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-8 bg-gradient-to-br from-card to-card/50">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-foreground">Project Overview</h2>
            <p className="text-muted-foreground">
              A comprehensive plagiarism detection tool built with modern web technologies and classic DSA algorithms
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-accent" />
              Technology Stack
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React 18</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Vite</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Shadcn UI</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">UI Components</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Radix UI</Badge>
                  <Badge variant="secondary">Lucide Icons</Badge>
                  <Badge variant="secondary">React Router</Badge>
                  <Badge variant="secondary">Sonner Toasts</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* DSA Algorithms */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              DSA Algorithms Implemented
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">KMP Algorithm</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Knuth-Morris-Pratt pattern matching with LPS array preprocessing
                </p>
                <Badge variant="outline" className="text-xs">O(n + m) complexity</Badge>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Boyer-Moore</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Efficient string search with bad character heuristic
                </p>
                <Badge variant="outline" className="text-xs">Best case O(n/m)</Badge>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Rabin-Karp</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Hash-based pattern matching with rolling hash optimization
                </p>
                <Badge variant="outline" className="text-xs">O(n + m) average</Badge>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Drag-and-drop file upload with validation',
                'Real-time processing visualization',
                'Side-by-side text comparison with visual connections',
                'Multiple algorithm selection (KMP, Boyer-Moore, Rabin-Karp)',
                'Plagiarism percentage calculation',
                'Detailed match segments display',
                'Performance metrics (time taken, matches found)',
                'Responsive design for all devices',
                'Dark/Light theme support',
                'Accessible UI components'
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-accent" />
              Project Structure
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg border border-border font-mono text-sm">
              <pre className="text-foreground overflow-x-auto">
{`src/
├── components/
│   ├── FileUpload.tsx           # File upload with drag-drop
│   ├── ProcessingVisualization.tsx # Animated processing steps
│   ├── TextComparisonView.tsx    # Side-by-side comparison
│   ├── ResultsDisplay.tsx        # Analysis results
│   ├── ProjectDocumentation.tsx  # This component
│   └── ui/                       # Reusable UI components
├── utils/
│   └── stringMatching.ts         # DSA algorithms implementation
├── pages/
│   └── Index.tsx                 # Main application page
└── index.css                     # Design system & theme`}
              </pre>
            </div>
          </div>

          {/* Design System */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              Design System
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The project uses a comprehensive design system with semantic color tokens, smooth animations, and responsive utilities.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Color Palette</h4>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary" />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-accent" />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-success" />
                      <span className="text-xs text-muted-foreground">Success</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Animations</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">fade-in</Badge>
                    <Badge variant="outline" className="text-xs">slide-up</Badge>
                    <Badge variant="outline" className="text-xs">scale-in</Badge>
                    <Badge variant="outline" className="text-xs">smooth transitions</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
