'use client'

import { useState, useEffect } from 'react';
import { Profile } from '@/types/login';
import { useSwitchProfile } from '@/features/auth/hooks/use-switch-profile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo2 from '../../../public/logo2.png';

export function ProfileSelection() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const activeProfiles = profiles.filter(p => p.status === 1);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [passCodeInput, setPassCodeInput] = useState('');
  const switchProfileMutation = useSwitchProfile();
  const router = useRouter();

  useEffect(() => {
    // Lấy danh sách profiles từ sessionStorage
    const stored = sessionStorage.getItem('availableProfiles');
    if (!stored) {
      // Nếu không có profiles, redirect về login
      router.push('/login');
      return;
    }
    try {
      const parsedProfiles = JSON.parse(stored);
      setProfiles(parsedProfiles);
    } catch (error) {
      console.error('Error parsing profiles:', error);
      router.push('/login');
    }
  }, [router]);

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setPassCodeInput('');
  };

  const handleLoginProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProfile = profiles.find(p => p.id === selectedProfileId);
    if (!selectedProfile) return;
  // Hỗ trợ cả accountId (camelCase) và accountid (lowercase) mà không dùng any
  const accountId = selectedProfile.accountId || (selectedProfile as unknown as { accountid?: string }).accountid || '';
    switchProfileMutation.mutate({
      profileId: selectedProfile.id,
      accountId,
      passCode: parseInt(passCodeInput || '0000', 10)
    });
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src={logo2}
                alt="Alpha Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🤖 Chọn ai đang sử dụng?
            </h1>
            <p className="text-gray-600">
              Chọn profile để bắt đầu học lập trình với Alpha Mini
            </p>
          </div>

          {/* Profiles Grid */}
          {!selectedProfileId ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {activeProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  disabled={switchProfileMutation.isPending}
                  className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Avatar className="w-20 h-20 mb-3 ring-2 ring-gray-200 group-hover:ring-orange-500 transition-all">
                    <AvatarImage src={profile.avartarUrl} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white text-2xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-center break-words w-full">
                    {profile.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {profile.isKid ? '👶 Trẻ em' : '👨‍👩‍👧 Phụ huynh'}
                  </span>
                  {profile.accountFullName && (
                    <span className="text-xs text-gray-400 mt-0.5 text-center">
                      {profile.accountFullName}
                    </span>
                  )}
                </button>
              ))}

              {/* Add profile button */}
              <button
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
                onClick={() => router.push('/create-parent-profile')}
                disabled={switchProfileMutation.isPending}
              >
                <div className="w-20 h-20 mb-3 rounded-full bg-gray-200 flex items-center justify-center hover:bg-orange-100 transition-colors">
                  <span className="text-4xl text-gray-400">+</span>
                </div>
                <span className="font-semibold text-gray-600 text-center">
                  Thêm profile
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginProfile} className="max-w-sm mx-auto mt-8 p-6 rounded-xl border-2 border-orange-200 bg-white shadow-lg">
              {(() => {
                const profile = profiles.find(p => p.id === selectedProfileId);
                if (!profile) return null;
                return (
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-20 h-20 mb-3 ring-2 ring-orange-300">
                      <AvatarImage src={profile.avartarUrl} alt={profile.name} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white text-2xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-gray-900 text-xl text-center">
                      {profile.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      {profile.isKid ? '👶 Trẻ em' : '👨‍👩‍👧 Phụ huynh'}
                    </span>
                  </div>
                );
              })()}
              <label htmlFor="passcode" className="block text-base font-medium mb-2 text-gray-700">Nhập mã PIN (Passcode)</label>
              <input
                id="passcode"
                type="password"
                value={passCodeInput}
                onChange={e => setPassCodeInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="w-full h-12 px-4 border rounded-lg text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Nhập 4 số mã PIN"
                disabled={switchProfileMutation.isPending}
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold text-lg mt-2 hover:from-orange-600 hover:to-yellow-600 transition-all"
                disabled={switchProfileMutation.isPending || passCodeInput.length !== 4}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className="w-full py-2 mt-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setSelectedProfileId(null)}
                disabled={switchProfileMutation.isPending}
              >
                ← Quay lại chọn profile
              </button>
            </form>
          )}

          {/* Loading state */}
          {switchProfileMutation.isPending && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-2 text-gray-600">Đang chuyển profile...</p>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
              disabled={switchProfileMutation.isPending}
            >
              ← Quay lại đăng nhập
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
