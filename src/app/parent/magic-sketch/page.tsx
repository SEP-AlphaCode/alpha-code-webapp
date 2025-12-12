"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlayCircle, Clock, Wand2, Search, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { useGetSketchList, useUploadCapture } from "@/features/magic-sketch/hooks/use-magic-sketch";
import { SketchDetailView } from "@/components/magic-sketch/sketch-detail";

export default function MagicSketchPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook Upload
  const { mutate: upload, isPending: isUploading } = useUploadCapture();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        const user = getUserInfoFromToken(token);
        setAccountId(user?.id || null);
      }
    }
  }, []);

  const { data: response, isLoading, error } = useGetSketchList(accountId);
  const items = response?.data || []; // API trả về { data: [...], ... }

  const filteredItems = items.filter((item) =>
    (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find((i) => i.id === selectedId);

  // Xử lý Upload file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && accountId) {
      upload({ file: e.target.files[0], accountId: accountId, description: "Uploaded from web" });
    }
  };

  if (isLoading) return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600"/></div>;
  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu.</div>;

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50/50">
      <div className="mb-8 flex justify-between items-start">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><Wand2 size={28} /></div>
             Phép thuật tranh vẽ
           </h1>
           <p className="text-gray-500 mt-2 ml-14">Biến tranh vẽ thành video hoạt hình với AI.</p>
        </div>
        
        {/* Nút Upload Ảnh Mới */}
        <div className="hidden sm:block">
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
           <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-blue-600 text-white">
              {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4"/>}
              Chụp ảnh mới
           </Button>
        </div>
      </div>

      {selectedId && selectedItem ? (
        <SketchDetailView item={selectedItem} onBack={() => setSelectedId(null)} />
      ) : (
        <div className="space-y-6">
          <div className="flex bg-white p-4 rounded-xl border shadow-sm gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Tìm kiếm..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {/* Mobile Upload Button */}
            <div className="sm:hidden w-full">
               <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-blue-600">
                  <Plus className="mr-2 h-4 w-4"/> Chụp ảnh mới
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} onClick={() => setSelectedId(item.id)} className="cursor-pointer h-full group">
                <Card className={cn("h-full overflow-hidden border-2 hover:shadow-xl transition-all", item.isCreated ? "border-transparent" : "border-dashed border-blue-300")}>
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img src={item.image} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {item.isCreated ? <PlayCircle className="text-white w-12 h-12" /> : <Wand2 className="text-white w-12 h-12" />}
                    </div>
                    <div className="absolute top-2 right-2">
                       {item.isCreated ? <Badge className="bg-green-500">Video sẵn sàng</Badge> : <Badge variant="secondary">Mới chụp</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center text-xs text-gray-400 mb-2">
                       <Clock size={12} className="mr-1"/> {new Date(item.createdDate).toLocaleDateString("vi-VN")}
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 text-gray-700">{item.description || "Chưa có mô tả"}</h3>
                  </CardContent>
                </Card>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">Chưa có tranh vẽ nào. Hãy thử tải lên ảnh mới!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}