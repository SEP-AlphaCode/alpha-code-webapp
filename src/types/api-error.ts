// Types cho error handling
export interface ApiResponse {
  success: boolean;
  error: string | null;
  message: JSON | null;
  timestamp: string;
  status: number;
}