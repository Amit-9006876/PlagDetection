import { AlgorithmResult } from '@/utils/stringMatching';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Percent, FileCheck, Code2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ResultsDisplayProps {
  result: AlgorithmResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getSeverityColor = (percentage: number) => {
    if (percentage < 20) return 'text-success';
    if (percentage < 50) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Score Card */}
      <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-accent/10 rounded-full">
            <Percent className={cn("w-12 h-12", getSeverityColor(result.plagiarismPercentage))} />
          </div>
          <div>
            <h2 className="text-6xl font-bold mb-2" style={{ 
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {result.plagiarismPercentage}%
            </h2>
            <p className="text-lg text-muted-foreground">Plagiarism Detected</p>
          </div>
          <Progress value={result.plagiarismPercentage} className="w-full h-3" />
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Code2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Algorithm</p>
              <p className="text-lg font-semibold text-foreground">{result.algorithm}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Time Taken</p>
              <p className="text-lg font-semibold text-foreground">
                {result.timeTaken.toFixed(2)} ms
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <FileCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Matches Found</p>
              <p className="text-lg font-semibold text-foreground">{result.matches.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Matched Segments */}
      {result.matches.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Matched Segments</h3>
            <Badge variant="secondary">{result.matches.length} segments</Badge>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {result.matches.slice(0, 10).map((match, index) => (
              <div
                key={index}
                className="p-4 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    Position: {match.index}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Length: {match.length}
                  </Badge>
                </div>
                <p className="text-sm font-mono text-foreground/90 break-words">
                  {match.text.substring(0, 100)}
                  {match.text.length > 100 ? '...' : ''}
                </p>
              </div>
            ))}
            {result.matches.length > 10 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                + {result.matches.length - 10} more matches
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
