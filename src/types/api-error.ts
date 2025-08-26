// Types cho error handling
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}