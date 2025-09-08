// Types cho error handling
export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}