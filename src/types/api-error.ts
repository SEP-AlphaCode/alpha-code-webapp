// Types cho error handling
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string
    }
  }
  message?: string
}