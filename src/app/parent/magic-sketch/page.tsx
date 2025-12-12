"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlayCircle, Clock, Wand2, Search, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { useGetSketchList, useUploadCapture } from "@/features/magic-sketch/hooks/use-magic-sketch";
import { SketchDetailView } from "@/components/magic-sketch/sketch-detail";
import ProtectAddon from "@/components/protect-addon";

// Định nghĩa Category ID cho Magic Sketch (Khớp với dữ liệu bạn đã tạo trong DB)
const MAGIC_SKETCH_CATEGORY_ID = 5;

// --- COMPONENT NỘI DUNG CHÍNH (Đã tách ra để bọc ProtectAddon bên ngoài) ---
const MagicSketchContent = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Lấy Account ID từ Token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        const user = getUserInfoFromToken(token);
        setAccountId(user?.id || null);
      }
    }
  }, []);

  // 2. Hook Upload & Get List
  const { mutate: upload, isPending: isUploading } = useUploadCapture();
  const { data: response, isLoading, error } = useGetSketchList(accountId);
  
  const items = response?.data || []; // API trả về { data: [...] }

  // 3. Filter & Find Logic
  const filteredItems = items.filter((item) =>
    (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find((i) => i.id === selectedId);

  // 4. Xử lý sự kiện Upload file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && accountId) {
      // Gọi API Upload ngay khi chọn file
      upload({ 
        file: e.target.files[0], 
        accountId: accountId, 
        description: "Uploaded from web app" 
      });
      
      // Reset input để cho phép chọn lại cùng 1 file nếu muốn
      e.target.value = "";
    }
  };

  // 5. Loading State
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] justify-center items-center flex-col gap-4">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600"/>
        <p className="text-gray-500 font-medium">Đang tải thư viện tranh vẽ...</p>
      </div>
    );
  }

  // 6. Error State
  if (error) {
    return (
      <div className="flex h-[calc(100vh-100px)] justify-center items-center flex-col gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Không thể tải dữ liệu</h3>
        <p className="text-gray-500 text-sm">Vui lòng kiểm tra kết nối internet và thử lại.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Tải lại trang</Button>
      </div>
    );
  }

  // 7. Render Giao diện chính
  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50/50">
      
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 shadow-sm"><Wand2 size={28} /></div>
             Phép thuật tranh vẽ
           </h1>
           <p className="text-gray-500 mt-2 md:ml-[60px]">
             Biến những bức tranh vẽ tay thành video hoạt hình sống động với AI.
           </p>
        </div>
        
        {/* Desktop Upload Button */}
        <div className="hidden md:block">
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
           <Button 
             onClick={() => fileInputRef.current?.click()} 
             disabled={isUploading} 
             className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
           >
              {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4"/>}
              Chụp ảnh mới
           </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {selectedId && selectedItem ? (
        // --- VIEW: CHI TIẾT & TẠO VIDEO ---
        <SketchDetailView item={selectedItem} onBack={() => setSelectedId(null)} />
      ) : (
        // --- VIEW: THƯ VIỆN (GALLERY) ---
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Toolbar & Search */}
          <div className="flex flex-col sm:flex-row bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Tìm kiếm theo mô tả..." 
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            
            {/* Mobile Upload Button */}
            <div className="md:hidden w-full">
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-blue-600">
                  {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4"/>}
                  Chụp ảnh mới
               </Button>
            </div>
          </div>

          {/* Grid List */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedId(item.id)} 
                  className="cursor-pointer h-full group"
                >
                  <Card className={cn(
                    "h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col", 
                    item.isCreated ? "border-transparent hover:border-blue-200" : "border-dashed border-blue-200 bg-blue-50/30 hover:border-blue-400"
                  )}>
                    
                    {/* Image Thumbnail */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                      <img 
                        src={item.image} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                        {item.isCreated ? (
                           <PlayCircle className="text-white w-12 h-12 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                        ) : (
                           <Wand2 className="text-white w-12 h-12 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                         {item.isCreated ? (
                            <Badge className="bg-green-500/90 hover:bg-green-600 shadow-sm backdrop-blur-sm">Video sẵn sàng</Badge>
                         ) : (
                            <Badge variant="secondary" className="bg-white/90 text-blue-600 shadow-sm backdrop-blur-sm">Mới chụp</Badge>
                         )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                         <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <Clock size={10}/> {new Date(item.createdDate).toLocaleDateString("vi-VN")}
                         </span>
                      </div>
                      
                      <h3 className={cn(
                        "font-medium text-sm line-clamp-2 mb-2 flex-1", 
                        item.description ? "text-gray-700" : "text-gray-400 italic"
                      )}>
                        {item.description || "Chưa có mô tả (Bấm để tạo video)"}
                      </h3>

                      {!item.isCreated && (
                        <div className="pt-3 border-t border-dashed border-gray-200">
                           <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:underline">
                             Tạo ngay <Wand2 size={12}/>
                           </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-300">
               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-blue-300" />
               </div>
               <h3 className="text-lg font-medium text-gray-900">Chưa có bức tranh nào</h3>
               <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                 Hãy tải lên bức tranh đầu tiên hoặc yêu cầu Robot Alpha Mini chụp hình để bắt đầu phép thuật!
               </p>
               <Button 
                 onClick={() => fileInputRef.current?.click()} 
                 variant="outline" 
                 className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50"
                 disabled={isUploading}
               >
                 Tải ảnh lên ngay
               </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- DEFAULT EXPORT: PAGE BỌC PROTECT ADDON ---
export default function MagicSketchPage() {
  return (
    <ProtectAddon category={MAGIC_SKETCH_CATEGORY_ID}>
      <MagicSketchContent />
    </ProtectAddon>
  );
}