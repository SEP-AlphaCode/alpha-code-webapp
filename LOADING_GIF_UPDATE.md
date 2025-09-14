# Loading GIF Integration Summary

## Các file đã được cập nhật để sử dụng loading_pop_up.gif:

### 1. Component Loading chính:
- `src/components/ui/loading-gif.tsx` - Component mới sử dụng GIF loading
- `src/components/ui/spinner.tsx` - Cập nhật để sử dụng LoadingGif
- `src/components/ui/loading.tsx` - Export wrapper cho loading components

### 2. Loading States đã cập nhật:
- `src/components/users/loading-state.tsx` - Thay Loader2 bằng LoadingGif
- `src/components/osmo-cards/loading-state.tsx` - Thay Loader2 bằng LoadingGif
- `src/components/i18n-loading-boundary.tsx` - Thay spinner CSS bằng LoadingGif

### 3. Auth Components:
- `src/components/auth-guard.tsx` - Thay spinner CSS bằng LoadingGif

### 4. Admin Pages:
- `src/app/admin/activities/actions/page.tsx` - Thay spinner CSS bằng LoadingGif
- `src/app/admin/activities/dances/page.tsx` - Thay spinner CSS bằng LoadingGif  
- `src/app/admin/activities/expressions/page.tsx` - Thay spinner CSS bằng LoadingGif

### 5. Modal và Form Components:
- `src/components/create-user-modal.tsx` - Thay Loader2 bằng LoadingGif
- `src/components/request-reset-password-form.tsx` - Thay Loader2 bằng LoadingGif
- `src/components/reset-password-form.tsx` - Thay spinner CSS bằng LoadingGif

## Tính năng LoadingGif Component:

### Props:
- `size`: 'sm' | 'md' | 'lg' | 'xl' - Kích thước GIF
- `message`: string - Thông báo loading (optional)
- `showMessage`: boolean - Hiển thị thông báo hay không
- `centered`: boolean - Căn giữa hay không
- `className`: string - CSS classes tùy chỉnh

### Ưu điểm:
- Sử dụng GIF có nền trong suốt, tránh làm vỡ layout
- Responsive với nhiều kích thước khác nhau
- Có thể bật/tắt thông báo
- Tùy chỉnh vị trí (centered/left-aligned)
- Tối ưu hóa với Next.js Image component

### Các component chưa thay đổi:
- RefreshCw icons với animate-spin trong analytics và rate-limit-warning (giữ nguyên vì có mục đích khác)

## Cách sử dụng trong tương lai:

```tsx
import LoadingGif from '@/components/ui/loading-gif';

// Loading đơn giản
<LoadingGif />

// Loading với message
<LoadingGif size="lg" message="Đang tải dữ liệu..." />

// Loading nhỏ không có message
<LoadingGif size="sm" showMessage={false} />
```
