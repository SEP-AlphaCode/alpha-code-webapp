import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, CheckCircle, Zap } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho Addon để tránh lỗi 'any'
interface Addon {
    id: string;
    name: string;
    price: number;
    description: string;
    categoryText: string;
    statusText: string;
}

// --- Dữ liệu mẫu (mock data) ---
const mockAddonsData = {
    "data": [
        {
            "id": "55181e82-543a-4899-893b-39d7d3d532dd",
            "name": "QR Code Navigator",
            "price": 1000000,
            "description": "Cho phép robot quét và phản ứng với các mã QR để điều hướng phức tạp.",
            "statusText": "ĐANG HOẠT ĐỘNG",
            "categoryText": "QR CODE"
        },
        {
            "id": "52735256-ac03-45c6-95e1-baa8acf64440",
            "name": "Osmo Drawing Module",
            "price": 300000,
            "description": "Kích hoạt khả năng nhận diện hình ảnh và tương tác với các trò chơi Osmo.",
            "statusText": "ĐANG HOẠT ĐỘNG",
            "categoryText": "OSMO"
        },
        {
            "id": "a0a1a2a3-b4b5-c6c7-d8d9-e0e1e2e3e4e5",
            "name": "Advanced Vision Pack",
            "price": 2500000,
            "description": "Nâng cấp thuật toán nhận diện khuôn mặt và vật thể AI.",
            "statusText": "ĐANG HOẠT ĐỘNG",
            "categoryText": "AI"
        },
         {
            "id": "b0b1b2b3-c4c5-d6d7-e8e9-f0f1f2f3f4f5",
            "name": "Sound Effect Library",
            "price": 0, // Miễn phí
            "description": "Thư viện âm thanh và giọng nói mở rộng cho các bài học tương tác.",
            "statusText": "ĐANG HOẠT ĐỘNG",
            "categoryText": "SOUND"
        }
    ],
    // Dữ liệu phân trang giữ nguyên nhưng ít quan trọng hơn trong giao diện Card
};

const formatCurrency = (amount: number): string => {
    if (amount === 0) return "Miễn phí";
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// Giả định một state hoặc prop để kiểm tra addon nào đã được đăng ký
const subscribedAddons: string[] = ["52735256-ac03-45c6-95e1-baa8acf64440"]; // Ví dụ: Addon 1 đã đăng ký

export default function AddonsStore() {
    const data: Addon[] = mockAddonsData.data as Addon[];

    // Trong một ứng dụng thực, bạn sẽ sử dụng useState để quản lý tìm kiếm
    // const [searchTerm, setSearchTerm] = React.useState(''); 
    // const filteredData = data.filter(addon => addon.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 p-10" suppressHydrationWarning>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Thư viện Addons cho Robot 🤖</h2>
                <p className="text-sm text-muted-foreground mt-1 md:mt-0">
                    Nâng cấp Alpha Mini với các tính năng mới và bài học chuyên sâu.
                </p>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="flex items-center space-x-4">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm Addon theo tên hoặc danh mục..."
                        className="pl-8 w-full"
                        // onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Có thể thêm Filter Category ở đây */}
            </div>

            {/* Grid hiển thị Addons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((addon) => {
                    const isSubscribed = subscribedAddons.includes(addon.id);

                    return (
                        <Card key={addon.id} className={`flex flex-col h-full ${isSubscribed ? 'border-2 border-green-500 shadow-lg' : ''}`}>
                            <CardHeader className="flex-row items-center justify-between pb-3">
                                <div>
                                    <CardTitle className="text-xl font-semibold">{addon.name}</CardTitle>
                                    <CardDescription className="mt-1">
                                        <Badge variant="secondary" className="mr-2">{addon.categoryText}</Badge>
                                    </CardDescription>
                                </div>
                                {/* Biểu tượng đại diện cho Addon */}
                                <Zap className="h-8 w-8 text-primary/70" /> 
                            </CardHeader>
                            <CardContent className="flex-1 pt-2">
                                <p className="text-sm text-muted-foreground mb-4 h-12 overflow-hidden">{addon.description}</p>
                                
                                <div className="text-2xl font-bold mb-4">
                                    {formatCurrency(addon.price)}
                                </div>

                                {/* Nút Thao tác (Call to Action) */}
                                {isSubscribed ? (
                                    <Button disabled className="w-full bg-green-500 hover:bg-green-500/90 text-white">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Đã đăng ký
                                    </Button>
                                ) : (
                                    <Button className="w-full">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        {addon.price === 0 ? 'Kích hoạt ngay' : `Đăng ký (${formatCurrency(addon.price)})`}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            
            {/* Nếu cần thiết, giữ lại phân trang */}
            <div className="flex items-center justify-center text-sm text-muted-foreground pt-4">
                <p>Tổng cộng Addon</p>
            </div>
        </div>
    );
}