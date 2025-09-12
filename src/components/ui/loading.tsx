// Global loading components exports
// Sử dụng file này để import các component loading cho toàn bộ app

export { default as LoadingGif } from './loading-gif';
export { Spinner } from './spinner';

// Export một component loading mặc định cho app
import LoadingGif from './loading-gif';
export { LoadingGif as AppLoader };
