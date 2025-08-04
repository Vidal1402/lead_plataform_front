export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  source: string;
  createdAt: string;
}

export interface LeadFilters {
  niche: string;
  city: string;
  country: string;
  quantity: number;
  ageRange?: {
    min: number;
    max: number;
  };
  fields?: string[];
}

export interface LeadGenerationProgress {
  total: number;
  generated: number;
  currentBatch: number;
  estimatedTimeRemaining: number;
  status: 'idle' | 'generating' | 'completed' | 'error';
  leads: Lead[];
}

export interface SearchHistory {
  id: string;
  filters: LeadFilters;
  totalLeads: number;
  createdAt: string;
  status: 'completed' | 'failed';
  downloadUrl?: string;
}

export interface LeadStats {
  totalGenerated: number;
  totalDownloads: number;
  averageGenerationTime: number;
  mostUsedFilters: {
    niche: string;
    count: number;
  }[];
} 