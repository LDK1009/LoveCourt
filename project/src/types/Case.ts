export interface Case {
  id: number;
  title: string;
  description: string;
  person_a: string;
  person_b: string;
  relationship: string;
  duration: string;
  category: string;
  tags: string[];
  created_at: string;
  user_id: string;
  status: 'pending' | 'completed';
  view_count: number;
}

export interface CaseInput {
  title: string;
  description: string;
  person_a: string;
  person_b: string;
  relationship: string;
  duration: string;
  category: string;
  tags: string[];
  intensity: string;
  character: string;
} 
