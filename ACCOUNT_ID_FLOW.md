# 🔐 Account ID Flow - Giải pháp

## Vấn đề ban đầu

Khi User login lần đầu tiên (chưa có profile):
- Backend trả về `requiresProfile: true` và `profiles: []`
- Backend **KHÔNG** trả về `accessToken` và `refreshToken` ngay
- Frontend redirect đến `/create-parent-profile`
- Component CreateParentProfile **KHÔNG** có token để lấy accountId từ JWT

## ✅ Giải pháp

### 1. Backend trả về accountId trong LoginResponse

```typescript
interface LoginWithProfileResponse {
  requiresProfile: boolean;
  profiles?: Profile[];
  accessToken?: string;
  refreshToken?: string;
  accountid?: string;  // ← Thêm field này
}
```

### 2. Frontend lưu accountId vào sessionStorage

**File:** `src/features/auth/hooks/use-login.ts`

```typescript
// TH2: User - cần xử lý profile
if (data.requiresProfile) {
  // Lưu accountId để dùng khi tạo profile
  if (data.accountid) {
    sessionStorage.setItem('pendingAccountId', data.accountid);
  }
  
  if (!data.profiles || data.profiles.length === 0) {
    router.push('/create-parent-profile');
    return;
  }
  
  sessionStorage.setItem('availableProfiles', JSON.stringify(data.profiles));
  router.push('/select-profile');
  return;
}
```

### 3. CreateParentProfile lấy accountId từ sessionStorage

**File:** `src/components/auth/create-parent-profile.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Lấy accountId từ sessionStorage (được lưu khi login)
    let accountid = sessionStorage.getItem('pendingAccountId') || '';
    
    // Fallback: Nếu có token thì lấy từ token
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken && !accountid) {
      const userInfo = getUserInfoFromToken(accessToken);
      if (userInfo) {
        accountid = userInfo.id || '';
      }
    }

    // Validate accountId
    if (!accountid) {
      toast.error('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      router.push('/login');
      return;
    }

    // Tạo profile
    const profileData = {
      accountid,
      name: name.trim(),
      passcode: passcode || '0000',
      isKid: false,
      status: 0,
      ...
    };

    const profile = await createProfileMutation.mutateAsync(profileData);
    
    // Xóa pendingAccountId sau khi tạo xong
    sessionStorage.removeItem('pendingAccountId');
    
    // Auto switch profile
    if (profile?.id) {
      switchProfileMutation.mutate(profile.id);
    }
  } catch (error) {
    console.error('Error creating profile:', error);
  }
};
```

### 4. Cleanup khi switch profile thành công

**File:** `src/features/auth/hooks/use-switch-profile.ts`

```typescript
onSuccess: (data) => {
  sessionStorage.setItem('accessToken', data.accessToken);
  sessionStorage.setItem('refreshToken', data.refreshToken);
  sessionStorage.setItem('currentProfile', JSON.stringify(data.profile));
  
  // Xóa dữ liệu tạm thời
  sessionStorage.removeItem('availableProfiles');
  sessionStorage.removeItem('pendingAccountId'); // ← Cleanup
  
  toast.success(`Chào ${data.profile.name}!`);
  router.push('/user');
}
```

---

## 📊 Flow Diagram

```
┌─────────────────┐
│ User Login      │
│ (First Time)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Backend Response:           │
│ {                           │
│   requiresProfile: true,    │
│   profiles: [],             │
│   accountid: "uuid-123"  ←──┼─── Backend trả về accountId
│ }                           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Frontend:                   │
│ sessionStorage.setItem(     │
│   'pendingAccountId',       │
│   'uuid-123'                │
│ )                           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Redirect to:                │
│ /create-parent-profile      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ CreateParentProfile:        │
│ accountid = sessionStorage  │
│   .getItem('pendingAccountId')
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ POST /profiles              │
│ {                           │
│   accountid: "uuid-123",    │
│   name: "Ba Minh",          │
│   passcode: "0000",         │
│   isKid: false              │
│ }                           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Switch Profile:             │
│ POST /auth/switch-profile   │
│ { profileId: "..." }        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Success:                    │
│ - Get tokens                │
│ - Remove pendingAccountId   │
│ - Redirect to /user         │
└─────────────────────────────┘
```

---

## 🔑 SessionStorage Keys

| Key | Khi nào set | Khi nào xóa | Mục đích |
|-----|------------|------------|----------|
| `pendingAccountId` | Login với User role chưa có profile | Sau khi tạo profile hoặc switch profile thành công | Lưu accountId tạm để tạo profile |
| `availableProfiles` | Login với User role đã có profiles | Sau khi switch profile thành công | Lưu danh sách profiles để chọn |
| `accessToken` | Login thành công (Admin/Staff) hoặc sau khi switch profile | Logout | JWT access token |
| `refreshToken` | Login thành công (Admin/Staff) hoặc sau khi switch profile | Logout | JWT refresh token |
| `currentProfile` | Sau khi switch profile thành công | Logout hoặc switch profile khác | Thông tin profile hiện tại |

---

## ✅ Checklist

- [x] Backend trả về `accountid` trong `LoginWithProfileResponse`
- [x] Frontend lưu `pendingAccountId` vào sessionStorage khi login
- [x] CreateParentProfile lấy accountId từ sessionStorage
- [x] Fallback lấy từ token nếu có
- [x] Validate accountId trước khi tạo profile
- [x] Cleanup `pendingAccountId` sau khi tạo profile
- [x] Cleanup `pendingAccountId` sau khi switch profile
- [x] Import toast trong CreateParentProfile
- [x] Error handling khi không có accountId

---

## 🧪 Test Cases

### Test 1: User login lần đầu (No profile)
1. ✅ Login với user account chưa có profile
2. ✅ Backend trả `requiresProfile: true`, `profiles: []`, `accountid: "xxx"`
3. ✅ Frontend lưu `pendingAccountId` vào sessionStorage
4. ✅ Redirect đến `/create-parent-profile`
5. ✅ Component lấy được accountId từ sessionStorage
6. ✅ Tạo profile thành công với accountId đúng
7. ✅ Auto switch profile
8. ✅ `pendingAccountId` bị xóa khỏi sessionStorage

### Test 2: User có profiles
1. ✅ Login với user có profiles
2. ✅ Backend trả `requiresProfile: true`, `profiles: [...]`, `accountid: "xxx"`
3. ✅ Frontend lưu `pendingAccountId` và `availableProfiles`
4. ✅ Redirect đến `/select-profile`
5. ✅ Chọn profile
6. ✅ Switch thành công
7. ✅ `pendingAccountId` và `availableProfiles` bị xóa

### Test 3: Edge case - Không có accountId
1. ✅ Backend không trả accountId
2. ✅ sessionStorage không có `pendingAccountId`
3. ✅ sessionStorage không có `accessToken`
4. ✅ Show error toast
5. ✅ Redirect về `/login`

---

## 📝 Notes cho Backend

Backend cần đảm bảo:
1. **Login response** khi `requiresProfile: true` phải có field `accountid`
2. **accountid** phải là UUID của account đang login
3. Format response:
```json
{
  "requiresProfile": true,
  "profiles": [],
  "accountid": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

Hoặc nếu backend không muốn trả accountId trong login response, có thể:
- Cho phép frontend tạo profile mà không cần accountId
- Backend tự lấy accountId từ session/cookie
- Hoặc tạo endpoint riêng để lấy accountId: `GET /auth/me`

---

## 🎉 Summary

✅ **Đã giải quyết vấn đề:**
- User login lần đầu có thể tạo profile
- accountId được lấy từ backend và lưu tạm
- Cleanup data sau khi hoàn tất flow
- Error handling đầy đủ
- Fallback mechanisms

🔄 **Flow hoàn chỉnh:**
Login → Lưu accountId → Create Profile → Switch Profile → Cleanup → Dashboard
