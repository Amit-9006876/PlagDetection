// DSA String Matching Algorithms Implementation

export type MatchResult = {
  index: number;
  length: number;
  text: string;
};

export type AlgorithmResult = {
  matches: MatchResult[];
  timeTaken: number;
  algorithm: string;
  plagiarismPercentage: number;
};

// KMP (Knuth-Morris-Pratt) Algorithm
function computeLPSArray(pattern: string): number[] {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

export function kmpSearch(text: string, pattern: string): MatchResult[] {
  const matches: MatchResult[] = [];
  if (pattern.length === 0 || text.length === 0) return matches;

  const lps = computeLPSArray(pattern);
  let i = 0; // text index
  let j = 0; // pattern index

  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      matches.push({
        index: i - j,
        length: pattern.length,
        text: text.substring(i - j, i),
      });
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  return matches;
}

// Boyer-Moore Algorithm
function badCharHeuristic(str: string): Map<string, number> {
  const badChar = new Map<string, number>();
  for (let i = 0; i < str.length; i++) {
    badChar.set(str[i], i);
  }
  return badChar;
}

export function boyerMooreSearch(text: string, pattern: string): MatchResult[] {
  const matches: MatchResult[] = [];
  if (pattern.length === 0 || text.length === 0) return matches;

  const badChar = badCharHeuristic(pattern);
  let s = 0;

  while (s <= text.length - pattern.length) {
    let j = pattern.length - 1;

    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
    }

    if (j < 0) {
      matches.push({
        index: s,
        length: pattern.length,
        text: text.substring(s, s + pattern.length),
      });
      s += s + pattern.length < text.length ? pattern.length - (badChar.get(text[s + pattern.length]) ?? -1) : 1;
    } else {
      s += Math.max(1, j - (badChar.get(text[s + j]) ?? -1));
    }
  }
  return matches;
}

// Rabin-Karp Algorithm
const PRIME = 101;

function hash(str: string, end: number): number {
  let hashValue = 0;
  for (let i = 0; i < end; i++) {
    hashValue += str.charCodeAt(i) * Math.pow(PRIME, i);
  }
  return hashValue;
}

function recalculateHash(str: string, oldIndex: number, newIndex: number, oldHash: number, patternLength: number): number {
  let newHash = oldHash - str.charCodeAt(oldIndex);
  newHash = newHash / PRIME;
  newHash += str.charCodeAt(newIndex) * Math.pow(PRIME, patternLength - 1);
  return newHash;
}

export function rabinKarpSearch(text: string, pattern: string): MatchResult[] {
  const matches: MatchResult[] = [];
  if (pattern.length === 0 || text.length === 0 || pattern.length > text.length) return matches;

  const patternHash = hash(pattern, pattern.length);
  let textHash = hash(text, pattern.length);

  for (let i = 0; i <= text.length - pattern.length; i++) {
    if (patternHash === textHash) {
      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        matches.push({
          index: i,
          length: pattern.length,
          text: text.substring(i, i + pattern.length),
        });
      }
    }

    if (i < text.length - pattern.length) {
      textHash = recalculateHash(text, i, i + pattern.length, textHash, pattern.length);
    }
  }
  return matches;
}

// Main analysis function
export function analyzePlagiarism(
  doc1: string,
  doc2: string,
  algorithm: 'kmp' | 'boyer-moore' | 'rabin-karp',
  minMatchLength: number = 20
): AlgorithmResult {
  const startTime = performance.now();
  
  // Split documents into sentences and clean
  const cleanText = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const doc1Clean = cleanText(doc1);
  const doc2Clean = cleanText(doc2);

  // Find all substrings of minimum length from doc1
  const patterns: string[] = [];
  for (let i = 0; i <= doc1Clean.length - minMatchLength; i++) {
    patterns.push(doc1Clean.substring(i, i + minMatchLength));
  }

  // Search for patterns in doc2
  let allMatches: MatchResult[] = [];
  const searchFn = algorithm === 'kmp' ? kmpSearch : algorithm === 'boyer-moore' ? boyerMooreSearch : rabinKarpSearch;

  patterns.forEach(pattern => {
    const matches = searchFn(doc2Clean, pattern);
    allMatches = [...allMatches, ...matches];
  });

  // Remove overlapping matches and calculate plagiarism percentage
  const uniqueMatches = mergeOverlappingMatches(allMatches);
  const matchedChars = uniqueMatches.reduce((sum, match) => sum + match.length, 0);
  const plagiarismPercentage = Math.min(100, (matchedChars / doc1Clean.length) * 100);

  const endTime = performance.now();

  return {
    matches: uniqueMatches,
    timeTaken: endTime - startTime,
    algorithm: algorithm === 'kmp' ? 'KMP' : algorithm === 'boyer-moore' ? 'Boyer-Moore' : 'Rabin-Karp',
    plagiarismPercentage: Math.round(plagiarismPercentage * 100) / 100,
  };
}

// Helper function to merge overlapping matches
function mergeOverlappingMatches(matches: MatchResult[]): MatchResult[] {
  if (matches.length === 0) return [];
  
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const merged: MatchResult[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.index <= last.index + last.length) {
      // Overlapping, merge them
      const endIndex = Math.max(last.index + last.length, current.index + current.length);
      last.length = endIndex - last.index;
    } else {
      merged.push(current);
    }
  }

  return merged;
}
