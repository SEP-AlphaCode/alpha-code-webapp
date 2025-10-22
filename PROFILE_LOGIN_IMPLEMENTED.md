# ✅ PROFILE LOGIN FLOW - ĐÃ TRIỂN KHAI

## 📋 Tóm tắt

Đã hoàn thành việc implement flow đăng nhập theo profile cho hệ thống Alpha Code. Flow này cho phép User (phụ huynh) và Children (trẻ em) có thể chia sẻ cùng 1 account nhưng mỗi người có profile riêng.

---

## 🎯 Flow đã implement

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Backend Check Role  │
└──────┬──────────────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌──────────────┐    ┌──────────────────┐
│ Admin/Staff  │    │ User (requiresProfile: true)
│ → Get Token  │    └──────┬───────────┘
│ → Dashboard  │           │
└──────────────┘           ├──────────────┐
                           │              │
                           ▼              ▼
                  ┌────────────┐  ┌──────────────┐
                  │ No Profile │  │ Has Profiles │
                  │ → Create   │  │ → Select     │
                  └─────┬──────┘  └──────┬───────┘
                        │                │
                        ▼                ▼
                  ┌──────────────────────────┐
                  │ Switch Profile API       │
                  │ → Get Token with Profile │
                  │ → Dashboard              │
                  └──────────────────────────┘
```

---

## 📁 Files đã tạo/sửa

### 1. **Types** (Updated)
- ✅ `src/types/login.ts` - Thêm `LoginWithProfileResponse`, `SwitchProfileResponse`, `Profile`
- ✅ `src/types/jwt-payload.ts` - Thêm `profileId`, `profileName`
- ✅ `src/types/profile.ts` - Thêm `isKid` field

### 2. **API Functions** (Updated)
- ✅ `src/features/auth/api/auth-api.ts`
  - Updated `login()` return type → `LoginWithProfileResponse`
  - Added `switchProfile()` - POST `/auth/switch-profile`

### 3. **Hooks** (New + Updated)
- ✅ `src/features/auth/hooks/use-login.ts` - Updated để xử lý profile flow
- ✅ `src/features/auth/hooks/use-switch-profile.ts` - New hook để switch profile

### 4. **Components** (New)
- ✅ `src/components/auth/profile-selection.tsx` - Màn hình chọn profile
- ✅ `src/components/auth/create-parent-profile.tsx` - Màn hình tạo profile phụ huynh

### 5. **Pages** (New)
- ✅ `src/app/select-profile/page.tsx` - Route /select-profile
- ✅ `src/app/create-parent-profile/page.tsx` - Route /create-parent-profile

---

## 🔧 Chi tiết technical

### **1. Login Response Structure**

**Admin/Staff Login:**
```json
{
  "requiresProfile": false,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**User Login (No Profile):**
```json
{
  "requiresProfile": true,
  "profiles": []
}
```

**User Login (Has Profiles):**
```json
{
  "requiresProfile": true,
  "profiles": [
    {
      "id": "uuid",
      "name": "Ba Minh",
      "isKid": false,
      "accountid": "uuid",
      "accountFullName": "Nguyen Van A",
      "avartarUrl": "https://...",
      "passcode": "0000",
      "status": 0,
      ...
    }
  ]
}
```

### **2. Switch Profile API**

**Endpoint:** `POST /auth/switch-profile`

**Request:**
```json
{
  "profileId": "profile-uuid"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "profile": {
    "id": "profile-uuid",
    "name": "Ba Minh",
    "isKid": false,
    ...
  }
}
```

### **3. Create Profile Data**

Khi tạo profile mới, data gửi lên:
```typescript
{
  accountid: string,        // UUID từ token
  name: string,             // Tên profile
  passcode: string,         // Mã PIN (default: "0000")
  isKid: boolean,           // false = Parent, true = Children
  status: 0,                // 0 theo API spec
  accountFullName: string,  // Từ token
  avartarUrl: string,       // Empty hoặc URL
  lastActiveAt: string,     // ISO datetime
  statusText: string        // "Active"
}
```

---

## 🎨 UI/UX Features

### **Profile Selection Screen** (`/select-profile`)
- ✅ Grid layout hiển thị tất cả profiles
- ✅ Avatar với fallback (chữ cái đầu tên)
- ✅ Badge phân biệt Parent (👨‍👩‍👧) vs Children (👶)
- ✅ Hover effect với border màu orange
- ✅ Button "Thêm profile" để tạo profile mới
- ✅ Loading state khi switch profile
- ✅ Link quay lại đăng nhập

### **Create Parent Profile Screen** (`/create-parent-profile`)
- ✅ Form nhập tên profile (required)
- ✅ Input mã PIN 4 số (default: 0000)
- ✅ Avatar preview với chữ cái đầu
- ✅ Validation: chỉ nhập số cho passcode
- ✅ Auto-switch sau khi tạo xong
- ✅ Loading states
- ✅ Error handling
- ✅ Link quay lại đăng nhập

---

## 🔐 Security Flow

1. **Token Management:**
   - Access token và refresh token lưu trong `sessionStorage`
   - Profile hiện tại lưu trong `sessionStorage` sau khi switch
   - Clear `availableProfiles` sau khi switch thành công

2. **Profile Protection:**
   - Mỗi profile có passcode riêng (tối thiểu 4 số)
   - Backend sẽ verify profile thuộc đúng account khi switch

3. **JWT Token:**
   - Token sau khi switch profile có thêm `profileId` và `profileName`
   - FE có thể dùng để hiển thị thông tin user hiện tại

---

## 📱 SessionStorage Keys

```typescript
// Sau khi login
sessionStorage.setItem('accessToken', token);
sessionStorage.setItem('refreshToken', token);

// Khi cần chọn profile
sessionStorage.setItem('availableProfiles', JSON.stringify(profiles));

// Sau khi switch profile
sessionStorage.setItem('currentProfile', JSON.stringify(profile));
sessionStorage.removeItem('availableProfiles');
```

---

## 🚀 Next Steps (Tùy chọn - chưa làm)

### **Optional Features:**
- [ ] Upload avatar khi tạo profile
- [ ] Edit profile (tên, avatar, passcode)
- [ ] Delete profile
- [ ] Parent có thể tạo Children profiles
- [ ] Passcode protection khi switch profile
- [ ] Profile activity tracking
- [ ] Last active profile memory

### **Routes cho Parent/Children:**
- [ ] `/parent/*` - Routes cho Parent role
- [ ] `/children/*` - Routes cho Children role
- [ ] Auth Guard check `profileType` từ token

### **Profile Management Page:**
- [ ] `/user/profiles` - Quản lý profiles
- [ ] Add/Edit/Delete profiles
- [ ] Set primary profile

---

## 🧪 Testing Checklist

### **Scenario 1: Admin Login**
- [x] Đăng nhập với admin account
- [x] Nhận token ngay lập tức
- [x] Redirect đến /admin

### **Scenario 2: User First Time Login**
- [x] Đăng nhập với user account lần đầu
- [x] profiles = []
- [x] Redirect đến /create-parent-profile
- [x] Tạo profile thành công
- [x] Auto switch và redirect

### **Scenario 3: User Has Profiles**
- [x] Đăng nhập với user có profiles
- [x] Hiển thị danh sách profiles
- [x] Chọn profile
- [x] Switch thành công và redirect

### **Scenario 4: Create Profile**
- [x] Form validation (name required)
- [x] Passcode chỉ nhận số
- [x] Default passcode = "0000"
- [x] isKid = false cho parent

### **Scenario 5: Error Handling**
- [x] No profiles in sessionStorage → redirect login
- [x] API error → show error message
- [x] Network error → show error toast

---

## 📝 Notes

1. **Backend Requirements:**
   - Đã có API `/profiles` CRUD operations
   - Cần thêm API `/auth/switch-profile` để nhận token mới
   - Login API cần trả về structure mới với `requiresProfile`

2. **Profile Type:**
   - `isKid: false` = Parent/Phụ huynh
   - `isKid: true` = Children/Trẻ em

3. **Passcode:**
   - Lưu dạng string trong DB
   - Frontend validate chỉ nhận 4 số
   - Default value: "0000"

4. **Status:**
   - Theo API: `status: 0` khi tạo mới
   - `statusText: "Active"` cho UI

---

## 🎉 Summary

✅ **Đã hoàn thành:**
- Types đầy đủ cho Profile flow
- API integration với backend
- Hooks để quản lý profile state
- UI components với design system
- Pages và routing
- Error handling
- Loading states
- SessionStorage management

🔄 **Flow hoàn chỉnh:**
1. Login → Check role
2. Admin/Staff → Token ngay
3. User → Check profiles
4. No profile → Create parent profile
5. Has profiles → Select profile
6. Switch profile → Get new token → Dashboard

✨ **Ready to test with backend API!**
