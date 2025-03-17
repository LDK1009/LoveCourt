export interface Vote {
  id: number;
  case_id: number;
  user_id: string;
  vote: 'person_a' | 'person_b' | 'both' | 'neither';
  created_at: string;
}

export interface VoteStats {
  person_a: number;
  person_b: number;
  both: number;
  neither: number;
  total: number;
} 
