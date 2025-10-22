# 📝 Kế hoạch triển khai Login theo Profile

## 🎯 Mục tiêu
Implement flow đăng nhập theo profile cho phép User (phụ huynh) và Children profile chia sẻ cùng 1 account.

---

## 📊 Phân tích luồng hiện tại vs luồng mới

### Luồng HIỆN TẠI:
```
Login → Backend trả token → Decode roleName → Redirect theo role
```

### Luồng MỚI (theo yêu cầu):
```
Login → Backend kiểm tra role
  ├─ Admin/Staff: Trả token ngay → Redirect dashboard
  └─ User: Kiểm tra profiles
       ├─ Chưa có profile: requiresProfile=true, profiles=[] → Tạo Parent Profile
       └─ Đã có profile: requiresProfile=true, profiles=[...] → Chọn profile → Call /switch-profile → Nhận token theo profile
```

---

## 🔧 CÁC BƯỚC TRIỂN KHAI

### **1. Tạo Types mới cho Profile**

📁 `src/types/profile.ts`
```typescript
export interface Profile {
  id: string;
  name: string;
  type: 'PARENT' | 'CHILDREN';
  avatarUrl?: string;
  accountId: string;
  status: number; // 1: active, 0: inactive
  createdAt?: string;
}

export interface LoginWithProfileResponse {
  requiresProfile: boolean; // true nếu là User role
  profiles?: Profile[]; // Danh sách profiles (nếu có)
  accessToken?: string; // Chỉ có nếu là Admin/Staff
  refreshToken?: string; // Chỉ có nếu là Admin/Staff
}

export interface SwitchProfileRequest {
  profileId: string;
}

export interface SwitchProfileResponse {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}
```

---

### **2. Cập nhật JWT Payload để có thông tin Profile**

📁 `src/types/jwt-payload.ts`
```typescript
export interface JWTPayload {
  id: string;
  fullName: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  // Thêm thông tin profile
  profileId?: string; // ID của profile đang dùng
  profileType?: 'PARENT' | 'CHILDREN'; // Loại profile
  profileName?: string; // Tên profile
  exp?: number;
  iat?: number;
}
```

---

### **3. Cập nhật API Auth để xử lý Profile**

📁 `src/features/auth/api/auth-api.ts`
```typescript
// Thêm các API mới
export const switchProfile = async (profileId: string): Promise<SwitchProfileResponse> => {
  try {
    const response = await usersHttp.post('/auth/switch-profile', { profileId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createParentProfile = async (profileData: {
  name: string;
  avatarUrl?: string;
}): Promise<Profile> => {
  try {
    const response = await usersHttp.post('/profiles/parent', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyProfiles = async (): Promise<Profile[]> => {
  try {
    const response = await usersHttp.get('/profiles/my-profiles');
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

**Cập nhật hàm login:**
```typescript
export const login = async (data: LoginRequest): Promise<LoginWithProfileResponse> => {
  try {
    const response = await usersHttp.post('/auth/login', data);
    let responseData = response.data;
    
    // Xử lý unwrap response như cũ
    if (responseData && responseData.data) {
      responseData = responseData.data;
    }
    
    return responseData;
  } catch (error) {
    throw error;
  }
};
```

---

### **4. Tạo Hook mới cho Profile**

📁 `src/features/auth/hooks/use-profile.ts`
```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { switchProfile, createParentProfile, getMyProfiles } from '@/features/auth/api/auth-api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useSwitchProfile = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: switchProfile,
    onSuccess: (data) => {
      // Lưu token mới
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      
      // Lưu thông tin profile hiện tại
      sessionStorage.setItem('currentProfile', JSON.stringify(data.profile));
      
      toast.success(`Chào ${data.profile.name}!`);
      
      // Redirect dựa trên profile type
      if (data.profile.type === 'PARENT') {
        router.push('/parent/dashboard');
      } else if (data.profile.type === 'CHILDREN') {
        router.push('/children/dashboard');
      }
    },
    onError: (error) => {
      toast.error('Không thể chuyển profile. Vui lòng thử lại.');
    }
  });
};

export const useCreateParentProfile = () => {
  return useMutation({
    mutationFn: createParentProfile,
    onSuccess: (profile) => {
      toast.success('Tạo profile thành công!');
    },
    onError: (error) => {
      toast.error('Không thể tạo profile. Vui lòng thử lại.');
    }
  });
};

export const useMyProfiles = () => {
  return useQuery({
    queryKey: ['my-profiles'],
    queryFn: getMyProfiles,
    enabled: !!sessionStorage.getItem('accessToken')
  });
};
```

---

### **5. Cập nhật useLogin Hook**

📁 `src/features/auth/hooks/use-login.ts`
```typescript
export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginWithProfileResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: async (data) => {
      // TH1: Admin/Staff - có token ngay
      if (data.accessToken && data.refreshToken && !data.requiresProfile) {
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
        
        const accountData = getTokenPayload(data.accessToken);
        if (!accountData) {
          toast.error('Lỗi: Không thể lấy thông tin tài khoản');
          return;
        }
        
        toast.success(`Chào mừng ${accountData.fullName}!`);
        
        const roleNameLower = accountData.roleName.toLowerCase();
        if (roleNameLower === 'admin') {
          router.push('/admin');
        } else if (roleNameLower === 'staff') {
          router.push('/staff');
        }
        return;
      }
      
      // TH2: User - cần xử lý profile
      if (data.requiresProfile) {
        // TH2.1: Chưa có profile → Tạo profile Parent
        if (!data.profiles || data.profiles.length === 0) {
          router.push('/create-parent-profile');
          return;
        }
        
        // TH2.2: Đã có profile → Chọn profile
        // Lưu tạm danh sách profiles vào sessionStorage
        sessionStorage.setItem('availableProfiles', JSON.stringify(data.profiles));
        router.push('/select-profile');
        return;
      }
      
      toast.error('Phản hồi từ server không hợp lệ');
    },
    onError: (error) => {
      // Xử lý lỗi như cũ
      const err = error as Error & { response?: { status: number } };
      if (err.response?.status === 401) {
        toast.error('Tên đăng nhập hoặc mật khẩu không chính xác.');
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  });
};
```

---

### **6. Tạo Component: Profile Selection Screen**

📁 `src/components/auth/profile-selection.tsx`
```typescript
'use client'

import { useState } from 'react';
import { Profile } from '@/types/profile';
import { useSwitchProfile } from '@/features/auth/hooks/use-profile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function ProfileSelection() {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const stored = sessionStorage.getItem('availableProfiles');
    return stored ? JSON.parse(stored) : [];
  });
  
  const switchProfileMutation = useSwitchProfile();

  const handleSelectProfile = (profileId: string) => {
    switchProfileMutation.mutate(profileId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chọn ai đang sử dụng?
            </h1>
            <p className="text-gray-600">
              Chọn profile để tiếp tục
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelectProfile(profile.id)}
                disabled={switchProfileMutation.isPending}
                className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
              >
                <Avatar className="w-20 h-20 mb-3">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="bg-orange-500 text-white text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-gray-900 group-hover:text-orange-600">
                  {profile.name}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {profile.type === 'PARENT' ? '👨‍👩‍👧 Phụ huynh' : '👶 Trẻ em'}
                </span>
              </button>
            ))}

            {/* Add profile button */}
            <button
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
              onClick={() => {/* Navigate to add profile */}}
            >
              <div className="w-20 h-20 mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">+</span>
              </div>
              <span className="font-semibold text-gray-600">
                Thêm profile
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### **7. Tạo Component: Create Parent Profile Screen**

📁 `src/components/auth/create-parent-profile.tsx`
```typescript
'use client'

import { useState } from 'react';
import { useCreateParentProfile, useSwitchProfile } from '@/features/auth/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function CreateParentProfile() {
  const [name, setName] = useState('');
  const createProfileMutation = useCreateParentProfile();
  const switchProfileMutation = useSwitchProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const profile = await createProfileMutation.mutateAsync({ name });
      // Sau khi tạo xong, tự động switch sang profile đó
      switchProfileMutation.mutate(profile.id);
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Tạo Profile Phụ Huynh
          </CardTitle>
          <p className="text-center text-gray-600 text-sm mt-2">
            Đây là lần đầu tiên bạn đăng nhập. Vui lòng tạo profile phụ huynh để tiếp tục.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-orange-500 text-white text-3xl">
                  {name ? name.charAt(0).toUpperCase() : '👤'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên của bạn *</Label>
              <Input
                id="name"
                type="text"
                placeholder="VD: Ba Minh, Mẹ Na"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={createProfileMutation.isPending || switchProfileMutation.isPending}
              />
              <p className="text-xs text-gray-500">
                Tên này sẽ được hiển thị khi chọn profile
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={!name || createProfileMutation.isPending || switchProfileMutation.isPending}
            >
              {createProfileMutation.isPending || switchProfileMutation.isPending
                ? 'Đang tạo...'
                : 'Tạo Profile & Tiếp tục'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### **8. Tạo Pages cho Profile Flow**

📁 `src/app/select-profile/page.tsx`
```typescript
'use client'

import { ProfileSelection } from '@/components/auth/profile-selection';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu không có profiles trong session → redirect về login
    const profiles = sessionStorage.getItem('availableProfiles');
    if (!profiles) {
      router.push('/login');
    }
  }, [router]);

  return <ProfileSelection />;
}
```

📁 `src/app/create-parent-profile/page.tsx`
```typescript
'use client'

import { CreateParentProfile } from '@/components/auth/create-parent-profile';

export default function CreateParentProfilePage() {
  return <CreateParentProfile />;
}
```

---

### **9. Cập nhật Auth Guard để check Profile**

📁 `src/components/auth-guard.tsx`
```typescript
'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isValidToken, getTokenPayload } from '@/utils/tokenUtils';

export function AuthGuard({ children, requiredRole }: { 
  children: React.ReactNode;
  requiredRole?: 'PARENT' | 'CHILDREN' | 'ADMIN' | 'STAFF';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('accessToken');
      
      if (!token || !(await isValidToken(token))) {
        router.push('/login');
        return;
      }

      const payload = getTokenPayload(token);
      if (!payload) {
        router.push('/login');
        return;
      }

      // Nếu route yêu cầu role cụ thể
      if (requiredRole) {
        // Check profile type cho Parent/Children
        if ((requiredRole === 'PARENT' || requiredRole === 'CHILDREN') 
            && payload.profileType !== requiredRole) {
          router.push('/select-profile');
          return;
        }
        
        // Check role cho Admin/Staff
        if ((requiredRole === 'ADMIN' || requiredRole === 'STAFF') 
            && payload.roleName !== requiredRole) {
          router.push('/unauthorized');
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router, requiredRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

### **10. Cập nhật routing cho Parent và Children**

Tạo layout riêng cho Parent và Children:

📁 `src/app/parent/layout.tsx`
```typescript
import { AuthGuard } from '@/components/auth-guard';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="PARENT">
      {children}
    </AuthGuard>
  );
}
```

📁 `src/app/children/layout.tsx`
```typescript
import { AuthGuard } from '@/components/auth-guard';

export default function ChildrenLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="CHILDREN">
      {children}
    </AuthGuard>
  );
}
```

---

## 📝 CHECKLIST TRIỂN KHAI

- [ ] **Backend API cần có:**
  - [ ] POST `/auth/login` trả về `requiresProfile` và `profiles[]` cho User role
  - [ ] POST `/auth/switch-profile` nhận `profileId`, trả token mới
  - [ ] POST `/profiles/parent` để tạo parent profile
  - [ ] GET `/profiles/my-profiles` để lấy danh sách profiles
  - [ ] JWT token có thêm `profileId`, `profileType`, `profileName`

- [ ] **Frontend cần làm:**
  - [x] Tạo types cho Profile
  - [x] Cập nhật JWT Payload type
  - [x] Thêm API calls mới vào auth-api.ts
  - [x] Tạo hooks: useSwitchProfile, useCreateParentProfile
  - [x] Cập nhật useLogin hook
  - [x] Tạo ProfileSelection component
  - [x] Tạo CreateParentProfile component
  - [x] Tạo pages: /select-profile, /create-parent-profile
  - [x] Cập nhật AuthGuard
  - [x] Tạo layouts: /parent, /children
  - [ ] Test toàn bộ flow

---

## 🔄 FLOW DIAGRAM

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Backend Check   │
│ Account Role    │
└──────┬──────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌─────────────────┐
│ Admin/Staff  │  │ User (Parent/   │
│ → Get Token  │  │  Children)      │
└──────┬───────┘  └────────┬────────┘
       │                   │
       ▼                   ▼
┌──────────────┐  ┌─────────────────┐
│ Redirect to  │  │ Check Profiles  │
│ Dashboard    │  └────────┬────────┘
└──────────────┘           │
                           ├──────────────┐
                           │              │
                           ▼              ▼
                  ┌───────────────┐ ┌───────────────┐
                  │ No Profile    │ │ Has Profiles  │
                  │ → Create      │ │ → Select      │
                  │   Parent      │ │   Profile     │
                  └───────┬───────┘ └───────┬───────┘
                          │                 │
                          │                 ▼
                          │      ┌─────────────────┐
                          │      │ Call Switch     │
                          │      │ Profile API     │
                          │      └────────┬────────┘
                          │               │
                          ▼               ▼
                  ┌─────────────────────────┐
                  │ Get Token with Profile  │
                  │ → Redirect Dashboard    │
                  └─────────────────────────┘
```

---

## 🚀 TESTING SCENARIOS

1. **Admin Login**: Đăng nhập với admin → nhận token ngay → redirect /admin
2. **Staff Login**: Đăng nhập với staff → nhận token ngay → redirect /staff
3. **User First Time**: Đăng nhập lần đầu → profiles=[] → /create-parent-profile
4. **User With Profiles**: Đăng nhập → có profiles → /select-profile
5. **Switch Profile**: Chọn profile → gọi API → nhận token mới → redirect dashboard
6. **Profile Guard**: Truy cập /parent với Children token → redirect /select-profile

---

## 💡 LƯU Ý

1. **Session Storage**: Lưu `availableProfiles` tạm thời khi chờ user chọn
2. **Token Refresh**: Khi refresh token, backend cần giữ nguyên thông tin profile
3. **Profile Switch**: Mỗi lần switch profile = 1 lần gọi API mới để đảm bảo security
4. **Avatar**: Có thể thêm upload avatar cho profile sau
5. **Profile Management**: Parent có thể tạo thêm Children profiles sau khi đã login

---

## 📞 BACKEND API CONTRACTS

### 1. POST /auth/login
**Request:**
```json
{
  "username": "user123",
  "password": "password"
}
```

**Response (Admin/Staff):**
```json
{
  "requiresProfile": false,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Response (User - No Profile):**
```json
{
  "requiresProfile": true,
  "profiles": []
}
```

**Response (User - With Profiles):**
```json
{
  "requiresProfile": true,
  "profiles": [
    {
      "id": "profile-uuid-1",
      "name": "Ba Minh",
      "type": "PARENT",
      "avatarUrl": "https://...",
      "accountId": "account-uuid",
      "status": 1
    },
    {
      "id": "profile-uuid-2",
      "name": "Bé Na",
      "type": "CHILDREN",
      "avatarUrl": "https://...",
      "accountId": "account-uuid",
      "status": 1
    }
  ]
}
```

### 2. POST /auth/switch-profile
**Request:**
```json
{
  "profileId": "profile-uuid-1"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "profile": {
    "id": "profile-uuid-1",
    "name": "Ba Minh",
    "type": "PARENT",
    "avatarUrl": "https://...",
    "accountId": "account-uuid",
    "status": 1
  }
}
```

### 3. POST /profiles/parent
**Request:**
```json
{
  "name": "Ba Minh",
  "avatarUrl": "https://..." // optional
}
```

**Response:**
```json
{
  "id": "profile-uuid-1",
  "name": "Ba Minh",
  "type": "PARENT",
  "avatarUrl": "https://...",
  "accountId": "account-uuid",
  "status": 1,
  "createdAt": "2025-10-21T..."
}
```

### 4. GET /profiles/my-profiles
**Response:**
```json
[
  {
    "id": "profile-uuid-1",
    "name": "Ba Minh",
    "type": "PARENT",
    "avatarUrl": "https://...",
    "accountId": "account-uuid",
    "status": 1
  },
  {
    "id": "profile-uuid-2",
    "name": "Bé Na",
    "type": "CHILDREN",
    "avatarUrl": "https://...",
    "accountId": "account-uuid",
    "status": 1
  }
]
```

---

## ✅ KẾT LUẬN

Để implement flow login theo profile, cần:

1. **Backend cung cấp**: 4 API endpoints mới + cập nhật JWT token
2. **Frontend triển khai**: 
   - 2 types files
   - 3 API functions
   - 3 hooks
   - 2 components
   - 2 pages
   - 2 layouts
   - Cập nhật useLogin hook và AuthGuard

**Ưu tiên triển khai theo thứ tự:**
1. Backend APIs trước
2. Types và API calls
3. Hooks
4. Components và Pages
5. Guards và Layouts
6. Testing end-to-end
