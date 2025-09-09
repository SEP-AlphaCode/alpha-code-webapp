"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
    Battery,
    WifiOff,
    Power,
    Settings,
    Activity,
    MapPin,
    Zap,
    CheckCircle,
    RefreshCw,
    Plus
} from 'lucide-react';

// Import tĩnh cả hai file ngôn ngữ
import viTranslations from '@/lib/i18n/dictionaries/teacher/teacher.vi.json';
import enTranslations from '@/lib/i18n/dictionaries/teacher/teacher.en.json';

const translations = {
    vi: viTranslations,
    en: enTranslations
};

// Hàm để xáo trộn mảng ngẫu nhiên
function shuffleArray(array: string[]) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export default function TeacherDashboard() {
    const [locale, setLocale] = useState('vi');
    const t = translations[locale]; 
    const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
    const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);

    useEffect(() => {
        if (t && t.things_to_try && t.things_to_try.prompts) {
            setShuffledPrompts(shuffleArray(t.things_to_try.prompts));
        }
    }, [locale, t]);

    const toggleLanguage = () => {
        setLocale(prevLocale => (prevLocale === 'vi' ? 'en' : 'vi'));
    };
    
    const handleRefreshPrompts = () => {
        if (t && t.things_to_try && t.things_to_try.prompts) {
            setShuffledPrompts(shuffleArray(t.things_to_try.prompts));
        }
    };

    if (!t) {
        return <div>Loading translations...</div>;
    }

    const robots = [
        {
            id: 'Alpha-01',
            name: 'Alpha Mini 01',
            status: 'online',
            battery: 94,
            location: 'Classroom A',
            lastSeen: '2 minutes ago',
            version: 'v2.1.3',
            students: 6,
            currentTask: 'Teaching Colors',
            uptime: '4h 23m',
            ip: '192.168.1.101',
            temperature: 32,
            image: '/alpha-mini-2.webp'
        },
        {
            id: 'Alpha-02',
            name: 'Alpha Mini 02',
            status: 'online',
            battery: 73,
            location: 'Classroom B',
            lastSeen: '1 minute ago',
            version: 'v2.1.3',
            students: 4,
            currentTask: 'Programming Basics',
            uptime: '3h 45m',
            ip: '192.168.1.102',
            temperature: 29,
            image: '/alpha-mini-2.webp'
        },
        {
            id: 'Alpha-03',
            name: 'Alpha Mini 03',
            status: 'offline',
            battery: 37,
            location: 'Charging Station',
            lastSeen: '15 minutes ago',
            version: 'v2.1.3',
            students: 0,
            currentTask: 'Idle',
            uptime: '0h 0m',
            ip: '192.168.1.103',
            temperature: 25,
            image: '/alpha-mini-2.webp'
        },
        {
            id: 'Alpha-04',
            name: 'Alpha Mini 04',
            status: 'charging',
            battery: 61,
            location: 'Classroom D',
            lastSeen: '5 minutes ago',
            version: 'v2.1.3',
            students: 0,
            currentTask: 'Charging',
            uptime: '0h 0m',
            ip: '192.168.1.104',
            temperature: 28,
            image: '/alpha-mini-2.webp'
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'offline':
                return <WifiOff className="h-4 w-4 text-gray-500" />;
            case 'charging':
                return <Zap className="h-4 w-4 text-yellow-500" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-100 text-green-800';
            case 'offline':
                return 'bg-gray-100 text-gray-800';
            case 'charging':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBatteryColor = (battery: number) => {
        if (battery > 60) return 'bg-green-500';
        if (battery > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const selectedRobotDetails = robots.find(robot => robot.id === selectedRobot);

    return (
        <div className="space-y-8 p-6 bg-[var(--background)] min-h-screen" suppressHydrationWarning>
            {/* Header with Language Switch */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-[var(--foreground)]">{t.header.title}</h1>
                <div className="flex items-center space-x-4">
                    <Button onClick={toggleLanguage}>
                        {locale === 'vi' ? 'English' : 'Tiếng Việt'}
                    </Button>
                </div>
            </div>

            {/* --- */}

            {/* Robot Selection Combobox */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">{t.robot_selection.title}</h2>
                <Select onValueChange={(value) => setSelectedRobot(value)}>
                    <SelectTrigger className="w-full min-h-20 py-4 px-3 text-lg font-semibold">
                        <SelectValue placeholder={t.robot_selection.title}>
                            {selectedRobotDetails ? (
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={selectedRobotDetails.image}
                                        alt={selectedRobotDetails.name}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{selectedRobotDetails.name}</span>
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            {getStatusIcon(selectedRobotDetails.status)}
                                            <span>
                                                {selectedRobotDetails.status === 'online' ? t.robot_selection.status_online : (selectedRobotDetails.status === 'offline' ? t.robot_selection.status_offline : t.robot_selection.charging)}
                                            </span>
                                            <Battery className="h-4 w-4 ml-1" />
                                            <span>{selectedRobotDetails.battery}%</span>
                                            <MapPin className="h-4 w-4 ml-1" />
                                            <span>{selectedRobotDetails.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span>{t.robot_selection.title}</span>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {robots.map((robot) => (
                            <SelectItem key={robot.id} value={robot.id} className="cursor-pointer py-3">
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={robot.image}
                                        alt={robot.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{robot.name} ({robot.id})</span>
                                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                                            {getStatusIcon(robot.status)}
                                            <span>
                                                {robot.status === 'online' ? t.robot_selection.status_online : (robot.status === 'offline' ? t.robot_selection.status_offline : t.robot_selection.charging)}
                                            </span>
                                            <Battery className="h-4 w-4 ml-1" />
                                            <span>{robot.battery}%</span>
                                            <MapPin className="h-4 w-4 ml-1" />
                                            <span>{robot.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* --- */}

            {/* Selected Robot Details */}
            {selectedRobotDetails && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t.robot_selection.details_title} - {selectedRobotDetails.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg">{t.robot_selection.system_info.title}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">ID:</span>
                                        <span className="text-[var(--foreground)]">{selectedRobotDetails.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">{t.robot_selection.system_info.firmware}:</span>
                                        <span className="text-[var(--foreground)]">{selectedRobotDetails.version}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">IP:</span>
                                        <span className="text-[var(--foreground)]">{selectedRobotDetails.ip}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">{t.robot_selection.system_info.temperature}:</span>
                                        <span className="text-[var(--foreground)]">{selectedRobotDetails.temperature}°C</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg">{t.robot_selection.current_status.title}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">{t.robot_selection.current_status.status}:</span>
                                        <Badge className={getStatusColor(selectedRobotDetails.status)}>
                                            {selectedRobotDetails.status === 'online' ? t.robot_selection.status_online : (selectedRobotDetails.status === 'offline' ? t.robot_selection.status_offline : t.robot_selection.charging)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">{t.robot_selection.current_status.task}:</span>
                                        <span className="text-[var(--foreground)]">{selectedRobotDetails.currentTask}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">{t.robot_selection.current_status.battery}:</span>
                                        <div className="flex items-center space-x-2 text-[var(--foreground)]">
                                            <Battery className="h-4 w-4" />
                                            <span>{selectedRobotDetails.battery}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[var(--muted)] rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getBatteryColor(selectedRobotDetails.battery)}`}
                                            style={{ width: `${selectedRobotDetails.battery}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">{t.robot_selection.current_status.location}:</span>
                                        <span className="text-[var(--foreground)]">{selectedRobotDetails.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg">{t.robot_selection.quick_actions.title}</h4>
                                <div className="space-y-2">
                                    <Button className="w-full" variant="outline">
                                        <Power className="h-4 w-4 mr-2" />
                                        {t.robot_selection.quick_actions.restart}
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Settings className="h-4 w-4 mr-2" />
                                        {t.robot_selection.quick_actions.settings}
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        {t.robot_selection.quick_actions.update_firmware}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* --- */}

            {/* Programming Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">{t.programming.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" suppressHydrationWarning>
                    <Card className="p-6 text-center cursor-pointer bg-gradient-to-br from-pink-300 via-purple-200 to-blue-200 text-[var(--card-foreground)] shadow-lg hover:scale-105 transition-transform border border-[var(--border)]" suppressHydrationWarning>
                        <CardHeader className="flex items-center justify-center">
                            <div className="text-4xl">✍️</div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg">{t.programming.create_actions}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 text-center cursor-pointer bg-gradient-to-br from-blue-300 via-cyan-200 to-green-200 text-[var(--card-foreground)] shadow-lg hover:scale-105 transition-transform border border-[var(--border)]" suppressHydrationWarning>
                        <CardHeader className="flex items-center justify-center">
                            <div className="text-4xl">📂</div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg">{t.programming.workspace}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 text-center cursor-pointer bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 text-[var(--card-foreground)] shadow-lg hover:scale-105 transition-transform border border-[var(--border)]" suppressHydrationWarning>
                        <CardHeader className="flex items-center justify-center">
                            <div className="text-4xl">🎨</div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg">{t.programming.my_works}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- */}

            {/* Entertainment Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">{t.entertainment.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" suppressHydrationWarning>
                    <Card className="p-6 text-center cursor-pointer bg-gradient-to-br from-pink-200 via-red-200 to-orange-200 text-[var(--card-foreground)] shadow-lg hover:scale-105 transition-transform border border-[var(--border)]" suppressHydrationWarning>
                        <CardHeader className="flex items-center justify-center">
                            <div className="text-4xl">🕺</div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg">{t.entertainment.action}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 text-center cursor-pointer bg-gradient-to-br from-orange-200 via-yellow-200 to-green-200 text-[var(--card-foreground)] shadow-lg hover:scale-105 transition-transform border border-[var(--border)]" suppressHydrationWarning>
                        <CardHeader className="flex items-center justify-center">
                            <div className="text-4xl">🖼️</div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg">{t.entertainment.album}</p>
                        </CardContent>
                    </Card>
                    <Card className="p-6 text-center cursor-pointer bg-gradient-to-br from-green-200 via-cyan-200 to-blue-200 text-[var(--card-foreground)] shadow-lg hover:scale-105 transition-transform border border-[var(--border)]" suppressHydrationWarning>
                        <CardHeader className="flex items-center justify-center">
                            <div className="text-4xl">🤝</div>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-lg">{t.entertainment.friends}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- */}

            {/* Things to Try Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">{t.things_to_try.title}</h2>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-800" onClick={handleRefreshPrompts}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t.things_to_try.refresh}
                    </Button>
                </div>
                <style jsx>{`
                    @keyframes moveRandomly {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100%); }
                    }
                `}</style>
                <div className="overflow-hidden space-y-4">
                    <div className="flex flex-col gap-4">
                        {/* Hàng 1 */}
                        <div className="flex space-x-4 animate-moveRandomly" style={{ animationDuration: '60s', animationIterationCount: 'infinite', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
                            {shuffledPrompts.slice(0, 5).map((prompt, index) => (
                                <div key={`row1-${index}`} className="flex-shrink-0 p-4 bg-[var(--card)] rounded-lg shadow-sm hover:bg-[var(--muted)] transition-colors cursor-pointer text-[var(--foreground)] border border-[var(--border)] min-w-[300px]">
                                    {prompt}
                                </div>
                            ))}
                            {shuffledPrompts.slice(0, 5).map((prompt, index) => (
                                <div key={`row1-clone-${index}`} className="flex-shrink-0 p-4 bg-[var(--card)] rounded-lg shadow-sm hover:bg-[var(--muted)] transition-colors cursor-pointer text-[var(--foreground)] border border-[var(--border)] min-w-[300px]">
                                    {prompt}
                                </div>
                            ))}
                        </div>
                        {/* Hàng 2 */}
                        <div className="flex space-x-4 animate-moveRandomly" style={{ animationDuration: '70s', animationIterationCount: 'infinite', animationTimingFunction: 'linear', animationDirection: 'reverse' }}>
                            {shuffledPrompts.slice(5, 10).map((prompt, index) => (
                                <div key={`row2-${index}`} className="flex-shrink-0 p-4 bg-[var(--card)] rounded-lg shadow-sm hover:bg-[var(--muted)] transition-colors cursor-pointer text-[var(--foreground)] border border-[var(--border)] min-w-[300px]">
                                    {prompt}
                                </div>
                            ))}
                            {shuffledPrompts.slice(5, 10).map((prompt, index) => (
                                <div key={`row2-clone-${index}`} className="flex-shrink-0 p-4 bg-[var(--card)] rounded-lg shadow-sm hover:bg-[var(--muted)] transition-colors cursor-pointer text-[var(--foreground)] border border-[var(--border)] min-w-[300px]">
                                    {prompt}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}