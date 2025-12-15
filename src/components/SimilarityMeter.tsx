import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SimilarityMeterProps {
  percentage: number;
  algorithm: string;
}

export function SimilarityMeter({ percentage, algorithm }: SimilarityMeterProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setAnimatedPercentage(0);
    setIsAnimating(true);
    
    const duration = 2000;
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setAnimatedPercentage(percentage);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(Math.round(current * 10) / 10);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  const getColor = (value: number) => {
    if (value < 20) return 'text-success';
    if (value < 50) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getGradient = (value: number) => {
    if (value < 20) return 'from-success/20 to-success/5';
    if (value < 50) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const getStrokeColor = (value: number) => {
    if (value < 20) return 'hsl(var(--success))';
    if (value < 50) return '#eab308';
    return 'hsl(var(--destructive))';
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <Card className={cn(
      "p-8 relative overflow-hidden transition-all duration-500",
      `bg-gradient-to-br ${getGradient(animatedPercentage)}`
    )}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular Gauge */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="12"
              className="opacity-30"
            />
            {/* Animated progress circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={getStrokeColor(animatedPercentage)}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-100 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${getStrokeColor(animatedPercentage)}40)`,
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
              "text-5xl font-bold transition-colors duration-300",
              getColor(animatedPercentage)
            )}>
              {animatedPercentage.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground mt-1">Similarity</span>
          </div>

          {/* Pulse effect */}
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "w-32 h-32 rounded-full animate-ping opacity-20",
                animatedPercentage < 20 ? 'bg-success' : 
                animatedPercentage < 50 ? 'bg-yellow-500' : 'bg-destructive'
              )} />
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {animatedPercentage < 20 ? 'Low Similarity' : 
               animatedPercentage < 50 ? 'Moderate Similarity' : 'High Similarity'}
            </h3>
            <p className="text-muted-foreground">
              {animatedPercentage < 20 
                ? 'Documents appear to be original with minimal overlap.'
                : animatedPercentage < 50 
                ? 'Some content overlap detected. Review highlighted sections.'
                : 'Significant content match found. Further review recommended.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="px-4 py-2 bg-background/50 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Algorithm</span>
              <span className="text-sm font-semibold text-foreground capitalize">{algorithm.replace('-', ' ')}</span>
            </div>
            <div className="px-4 py-2 bg-background/50 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Status</span>
              <span className={cn("text-sm font-semibold", getColor(animatedPercentage))}>
                {animatedPercentage < 20 ? 'Pass' : animatedPercentage < 50 ? 'Review' : 'Flag'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
