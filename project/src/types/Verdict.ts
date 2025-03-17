export interface Verdict {
  id: number;
  case_id: number;
  verdict: 'person_a' | 'person_b' | 'both' | 'neither';
  reasoning: string;
  legal_basis: string;
  ai_comment: string;
  created_at: string;
} 