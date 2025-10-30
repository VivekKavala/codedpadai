export type Visibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED';

export interface Pad {
  id: string;
  title: string;
  content: string;
  visibility: Visibility;
  encrypted: boolean;
  passphrase?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CreatePadData {
  title: string;
  content: string;
  visibility: Visibility;
  passphrase?: string;
  encrypt?: boolean;
}

export interface PadViewData {
  pad: Pad;
  decryptedContent?: string;
  requiresPassword: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export interface ProcessedLog {
  id: string;
  action: string;
  // Use string for serializability
  timestamp: string;
  ipAddress: string | null;
  userAgent: string | null;
  // Pre-formatted location strings
  locationText: string;
  locationTitle: string;
}
