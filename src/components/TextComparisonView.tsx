import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchResult } from '@/utils/stringMatching';
import { cn } from '@/lib/utils';

interface TextComparisonViewProps {
  doc1: string;
  doc2: string;
  matches: MatchResult[];
}

export function TextComparisonView({ doc1, doc2, matches }: TextComparisonViewProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [connections, setConnections] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; id: number }>>([]);
  const [activeMatchId, setActiveMatchId] = useState<number | null>(null);

  // Find match positions in doc1
  const doc1Matches = matches.map(match => {
    const cleanDoc1 = doc1.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanMatch = match.text;
    const index = cleanDoc1.indexOf(cleanMatch);
    return { match, doc1Index: index };
  }).filter(m => m.doc1Index !== -1);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    const calculateConnections = () => {
      const newConnections: Array<{ x1: number; y1: number; x2: number; y2: number; id: number }> = [];
      const leftRect = leftRef.current!.getBoundingClientRect();

      doc1Matches.slice(0, 20).forEach((match, index) => {
        const leftHighlight = leftRef.current!.querySelector(`[data-match-id="${index}"]`);
        const rightHighlight = rightRef.current!.querySelector(`[data-match-id="${index}"]`);

        if (leftHighlight && rightHighlight) {
          const leftHighlightRect = leftHighlight.getBoundingClientRect();
          const rightHighlightRect = rightHighlight.getBoundingClientRect();

          newConnections.push({
            x1: leftHighlightRect.right - leftRect.left,
            y1: leftHighlightRect.top - leftRect.top + leftHighlightRect.height / 2,
            x2: rightHighlightRect.left - leftRect.left,
            y2: rightHighlightRect.top - leftRect.top + rightHighlightRect.height / 2,
            id: index,
          });
        }
      });

      setConnections(newConnections);
    };

    calculateConnections();
    window.addEventListener('resize', calculateConnections);
    return () => window.removeEventListener('resize', calculateConnections);
  }, [doc1, doc2, matches]);

  const handleMatchClick = useCallback((matchId: number) => {
    setActiveMatchId(prev => prev === matchId ? null : matchId);
    
    // Scroll to match in both panels
    const leftMatch = leftRef.current?.querySelector(`[data-match-id="${matchId}"]`);
    const rightMatch = rightRef.current?.querySelector(`[data-match-id="${matchId}"]`);
    
    leftMatch?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      rightMatch?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }, []);

  const handleMatchHover = useCallback((matchId: number | null) => {
    if (activeMatchId === null) {
      setActiveMatchId(matchId);
    }
  }, [activeMatchId]);

  const renderHighlightedText = (text: string, isSource: boolean) => {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (matches.length === 0) {
      return <span>{text}</span>;
    }

    const segments: Array<{ text: string; isMatch: boolean; matchId?: number }> = [];
    let lastIndex = 0;

    const relevantMatches = isSource ? doc1Matches : matches;
    const processedMatches = isSource 
      ? relevantMatches.slice(0, 20).map(m => ({ ...m.match, index: m.doc1Index }))
      : relevantMatches.slice(0, 20);

    processedMatches.forEach((match, matchId) => {
      const matchIndex = match.index;
      if (matchIndex === -1) return;

      if (matchIndex > lastIndex) {
        segments.push({ text: text.slice(lastIndex, matchIndex), isMatch: false });
      }

      segments.push({
        text: text.slice(matchIndex, matchIndex + match.length),
        isMatch: true,
        matchId,
      });

      lastIndex = matchIndex + match.length;
    });

    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), isMatch: false });
    }

    return (
      <>
        {segments.map((segment, index) => (
          segment.isMatch ? (
            <mark
              key={index}
              data-match-id={segment.matchId}
              onClick={() => handleMatchClick(segment.matchId!)}
              onMouseEnter={() => handleMatchHover(segment.matchId!)}
              onMouseLeave={() => handleMatchHover(null)}
              className={cn(
                "rounded px-1 transition-all duration-300 cursor-pointer",
                activeMatchId === segment.matchId
                  ? "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background scale-105"
                  : "bg-accent/30 text-foreground hover:bg-accent/50"
              )}
            >
              {segment.text}
            </mark>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        ))}
      </>
    );
  };

  return (
    <Card className="p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-foreground">Visual Text Comparison</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{doc1Matches.length} matches</Badge>
            <Badge variant="outline" className="text-xs">Click to highlight</Badge>
          </div>
        </div>

        <div className="relative grid md:grid-cols-2 gap-6">
          {/* Left Document */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-foreground">Source Document</span>
            </div>
            <div
              ref={leftRef}
              className="relative p-4 bg-muted/30 rounded-lg max-h-96 overflow-y-auto border border-border scroll-smooth"
            >
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {renderHighlightedText(doc1, true)}
              </p>
            </div>
          </div>

          {/* Right Document */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium text-foreground">Target Document</span>
            </div>
            <div
              ref={rightRef}
              className="relative p-4 bg-muted/30 rounded-lg max-h-96 overflow-y-auto border border-border scroll-smooth"
            >
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {renderHighlightedText(doc2, false)}
              </p>
            </div>
          </div>

          {/* Connection Lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block"
            style={{ zIndex: 1 }}
          >
            {connections.map((conn) => (
              <line
                key={conn.id}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke={activeMatchId === conn.id ? "hsl(var(--accent))" : "hsl(var(--accent))"}
                strokeWidth={activeMatchId === conn.id ? "3" : "1"}
                strokeOpacity={activeMatchId === conn.id ? "0.8" : "0.3"}
                className="transition-all duration-300"
              />
            ))}
          </svg>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-accent/30 rounded" />
            <span>Matched segments</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-accent rounded" />
            <span>Active selection</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 bg-accent/30" />
            <span>Connections (desktop)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
