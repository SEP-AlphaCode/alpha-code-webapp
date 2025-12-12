"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  ImageIcon, Video, PlayCircle, Clock, 
  ArrowLeft, Wand2, Search, Filter, CheckCircle2,
  RefreshCcw, X, Edit3, Loader2, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Đảm bảo bạn có file utils này (mặc định của shadcn)

// =========================================================================
// 1. TYPE DEFINITIONS (MÔ HÌNH DỮ LIỆU)
// =========================================================================
interface VideoCaptureEntity {
  id: string;
  createdDate: string;
  lastUpdated: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  image: string;
  videoUrl?: string; // Nullable
  accountId: string;
  description?: string; // Nullable
  isCreated: boolean; // bit -> boolean
}

// =========================================================================
// 2. MOCK DATA (DỮ LIỆU GIẢ LẬP)
// =========================================================================
const MOCK_DATA: VideoCaptureEntity[] = [
  {
    id: '1',
    createdDate: '2025-12-06T08:30:00Z',
    lastUpdated: '2025-12-06T08:35:00Z',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    accountId: 'user-01',
    isCreated: true,
    description: 'Một chú voi cam khổng lồ đang đi trong rừng rậm huyền bí'
  },
  {
    id: '2',
    createdDate: '2025-12-06T10:15:00Z',
    lastUpdated: '2025-12-06T10:15:00Z',
    status: 'pending',
    image: 'https://img.freepik.com/free-vector/hand-drawn-stickman-collection_23-2149093638.jpg',
    accountId: 'user-01',
    isCreated: false,
    description: ''
  },
  {
    id: '3',
    createdDate: '2025-12-05T14:20:00Z',
    lastUpdated: '2025-12-05T14:20:00Z',
    status: 'pending',
    image: 'https://img.freepik.com/premium-vector/kids-drawing-vector-set-children-illustration-sketch-doodle-seamless-pattern-background_160308-2780.jpg',
    accountId: 'user-01',
    isCreated: false,
    description: ''
  },
   {
    id: '4',
    createdDate: '2025-12-04T09:00:00Z',
    lastUpdated: '2025-12-04T09:00:00Z',
    status: 'completed',
    image: 'https://img.freepik.com/free-vector/hand-drawn-ufo-element_23-2149725586.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    accountId: 'user-01',
    isCreated: true,
    description: 'Phi thuyền của người ngoài hành tinh đang bay'
  }
];

// =========================================================================
// 3. COMPONENT: CONFIRMATION MODAL (CUSTOM THEME)
// =========================================================================
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop mờ */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Bạn chưa nhập mô tả?
          </h3>
          
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Nếu để trống, Robot sẽ <b>tự do sáng tạo</b> nội dung video dựa trên hình ảnh. Bạn có chắc chắn muốn tiếp tục không?
          </p>

          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Quay lại viết tiếp
            </Button>
            <Button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              Vẫn tạo Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. COMPONENT: SKETCH DETAIL VIEW (LOGIC CHÍNH)
// =========================================================================
const SketchDetailView = ({ 
  item, 
  onBack, 
  onGenerate 
}: { 
  item: VideoCaptureEntity, 
  onBack: () => void,
  onGenerate: (id: string, desc: string) => void
}) => {
  // State quản lý form
  const [description, setDescription] = useState(item.description || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Reset state khi item thay đổi
  useEffect(() => {
    setDescription(item.description || '');
    setIsRegenerating(false);
    setIsProcessing(false);
    setShowConfirmModal(false);
  }, [item]);

  // Hàm thực thi tạo video (Sau khi confirm)
  const executeGeneration = () => {
    setIsProcessing(true);
    // Giả lập API call mất 2.5 giây
    setTimeout(() => {
      onGenerate(item.id, description);
      setIsProcessing(false);
      setIsRegenerating(false);
    }, 2500);
  };

  // Hàm xử lý khi bấm nút Submit
  const handlePreSubmit = () => {
    // Check validation
    if (!description.trim()) {
      setShowConfirmModal(true);
      return;
    }
    executeGeneration();
  };

  return (
    <>
      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeGeneration}
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100 pl-0 md:pl-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Quay lại thư viện</span>
          </Button>
          <div className="h-6 w-px bg-gray-300 hidden md:block" />
          <span className="text-gray-500 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date(item.createdDate).toLocaleString('vi-VN', { 
              year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[650px]">
          
          {/* CỘT TRÁI: ẢNH GỐC (INPUT) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="h-full border-blue-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-50 p-3 border-b font-medium text-gray-700 flex items-center gap-2 text-sm">
                <ImageIcon className="w-4 h-4 text-blue-600" /> Ảnh gốc (Input)
              </div>
              <div className="flex-1 bg-gray-100 relative group overflow-hidden min-h-[300px]">
                 <img 
                   src={item.image} 
                   className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105" 
                   alt="Original sketch"
                 />
              </div>
            </Card>
          </div>

          {/* CỘT PHẢI: LOGIC CHÍNH */}
          <div className="lg:col-span-8">
            <Card className="h-full border-blue-100 shadow-md flex flex-col overflow-hidden">
              
              {/* Header Card */}
              <div className="bg-white p-3 border-b font-medium text-gray-900 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm md:text-base">
                    {item.isCreated ? (
                      <> <Video className="w-5 h-5 text-purple-600" /> Kết quả Video </>
                    ) : (
                      <> <Wand2 className="w-5 h-5 text-blue-600" /> Thiết lập tạo Video </>
                    )}
                 </div>
                 
                 {item.isCreated && (
                   <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Hoàn thành
                   </Badge>
                 )}
              </div>

              {/* Body Card */}
              <div className="flex-1 flex flex-col relative bg-gray-900">
                  
                  {/* --- KHUNG VIDEO (Hiện khi đã tạo & không loading) --- */}
                  {item.isCreated && !isProcessing && (
                    <div className={cn(
                      "flex-1 flex items-center justify-center overflow-hidden relative transition-all duration-500",
                      isRegenerating ? "h-1/3 opacity-40 blur-[2px]" : "h-full bg-black"
                    )}>
                       <video 
                         src={item.videoUrl} 
                         controls={!isRegenerating} 
                         autoPlay={!isRegenerating}
                         loop 
                         className="w-full h-full object-contain"
                       />
                    </div>
                  )}

                  {/* --- KHUNG FORM (Hiện khi chưa tạo HOẶC đang Regen HOẶC đang Loading) --- */}
                  {(!item.isCreated || isRegenerating || isProcessing) && (
                     <div className={cn(
                       "bg-white flex flex-col gap-4 transition-all duration-300 absolute inset-x-0 bottom-0 z-10",
                       item.isCreated ? "h-2/3 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6" : "h-full justify-center items-center p-6 bg-gradient-to-br from-white to-blue-50"
                     )}>
                        
                        <div className={item.isCreated ? "w-full h-full flex flex-col" : "text-center max-w-lg w-full"}>
                          
                          {/* LOADING STATE */}
                          {isProcessing ? (
                             <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                <h3 className="font-semibold text-gray-900 text-lg">Đang phù phép...</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                                  Robot đang phân tích tranh vẽ và mô tả của bạn để tạo ra video hoạt hình.
                                </p>
                             </div>
                          ) : (
                             <>
                               {/* HEADER: Trường hợp chưa có Video */}
                               {!item.isCreated && (
                                 <div className="mb-8">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                      <Wand2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Sẵn sàng tạo Video!</h3>
                                    <p className="text-gray-500 mt-2">Mô tả ý tưởng để AI hiểu rõ hơn bức tranh của bé.</p>
                                 </div>
                               )}

                               {/* HEADER: Trường hợp đang Regen */}
                               {item.isCreated && (
                                 <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                                      <Edit3 className="w-5 h-5 text-blue-600" />
                                      Chỉnh sửa mô tả & Tạo lại
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => setIsRegenerating(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                      <X className="w-4 h-4 mr-1" /> Hủy bỏ
                                    </Button>
                                 </div>
                               )}

                               {/* INPUT FIELDS */}
                               <div className={cn("space-y-5 flex-1 flex flex-col", !item.isCreated && "w-full text-left")}>
                                  <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-gray-700">
                                      {item.isCreated ? "Bạn muốn thay đổi điều gì?" : "Mô tả ý tưởng (Description):"}
                                    </label>
                                    <Textarea 
                                      placeholder={item.isCreated ? "Ví dụ: Màu sắc tươi sáng hơn..." : "Ví dụ: Con cá đang bơi..."}
                                      className="min-h-[120px] bg-white focus:ring-blue-500 resize-none text-base p-4"
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-400 text-right">Có thể để trống để AI tự sáng tạo</p>
                                  </div>
                                  
                                  <Button 
                                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-[1.01]"
                                    onClick={handlePreSubmit}
                                  >
                                    {item.isCreated ? (
                                      <> <RefreshCcw className="w-5 h-5 mr-2" /> Xác nhận tạo lại Video </>
                                    ) : (
                                      <> <PlayCircle className="w-5 h-5 mr-2" /> Bắt đầu tạo Video </>
                                    )}
                                  </Button>
                               </div>
                             </>
                          )}
                        </div>
                     </div>
                  )}

                  {/* --- STATIC INFO (Hiện khi xem Video bình thường) --- */}
                  {item.isCreated && !isRegenerating && !isProcessing && (
                    <div className="bg-white p-4 border-t min-h-[140px] flex flex-col justify-between">
                       <div className="space-y-1">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Edit3 size={12}/> Mô tả hiện tại
                          </span>
                          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 border border-gray-100 max-h-[80px] overflow-y-auto">
                            {description ? description : <span className="italic text-gray-400">Không có mô tả chi tiết</span>}
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-end pt-3 mt-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsRegenerating(true)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <RefreshCcw className="w-3 h-3 mr-2" />
                            Kết quả chưa ưng ý? Tạo lại
                          </Button>
                       </div>
                    </div>
                  )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

// =========================================================================
// 5. COMPONENT PAGE CHÍNH (QUẢN LÝ STATE LIST)
// =========================================================================
export default function MagicSketchPage() {
  const [items, setItems] = useState<VideoCaptureEntity[]>(MOCK_DATA);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy item đang chọn
  const selectedItem = items.find(i => i.id === selectedId);

  // Filter cho list
  const filteredItems = items.filter(item => 
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (!item.description && searchTerm === '')
  );

  // Hàm update dữ liệu khi tạo/sửa video thành công
  const handleGenerateVideo = (id: string, desc: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isCreated: true, 
          status: 'completed' as const,
          description: desc,
          lastUpdated: new Date().toISOString(),
          // Trong thực tế, URL này sẽ trả về từ Server
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' 
        };
      }
      return item;
    });
    setItems(newItems);
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50/50">
      
      {/* 5.1 Page Header */}
      <div className="mb-8">
         <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
           <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 shadow-sm">
             <Wand2 size={28}/>
           </div>
           Phép thuật tranh vẽ
         </h1>
         <p className="text-gray-500 mt-2 md:ml-[60px]">
           Quản lý các bản chụp từ Robot Alpha Mini và chuyển đổi thành Video hoạt hình.
         </p>
      </div>

      {/* 5.2 Conditional Rendering: Detail vs List */}
      {selectedId && selectedItem ? (
        
        // --- VIEW: DETAIL ---
        <SketchDetailView 
          item={selectedItem} 
          onBack={() => setSelectedId(null)} 
          onGenerate={handleGenerateVideo}
        />
        
      ) : (
        
        // --- VIEW: GALLERY LIST ---
        <div className="animate-in fade-in duration-500 space-y-6">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
               <Input 
                 type="text" 
                 placeholder="Tìm kiếm theo mô tả..." 
                 className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4" /> Lọc: Tất cả
                </Button>
            </div>
          </div>

          {/* Grid Items */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedId(item.id)}
                  className="group cursor-pointer h-full"
                >
                  <Card className={cn(
                    "h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
                    item.isCreated 
                      ? "border-transparent hover:border-blue-300 shadow-sm" 
                      : "border-dashed border-blue-200 bg-blue-50/30 hover:border-blue-400"
                  )}>
                    {/* Thumbnail Image */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                      <img 
                        src={item.image} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Hover Overlay Icon */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                         {item.isCreated ? (
                            <PlayCircle className="text-white w-14 h-14 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                         ) : (
                            <Wand2 className="text-white w-14 h-14 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                         )}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {item.isCreated ? (
                          <Badge className="bg-green-500/90 hover:bg-green-600 shadow-sm backdrop-blur">
                            Video sẵn sàng
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-white/90 text-blue-600 shadow-sm backdrop-blur">
                            Mới chụp
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-4 bg-white flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                         <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <Clock size={10}/> {new Date(item.createdDate).toLocaleDateString('vi-VN')}
                         </span>
                         {item.isCreated && <span className="text-green-600 font-medium">Đã hoàn tất</span>}
                      </div>
                      <h3 className={cn(
                        "font-medium line-clamp-2 text-sm",
                        item.description ? "text-gray-700" : "text-gray-400 italic"
                      )}>
                        {item.description || 'Chưa có mô tả (Bấm để tạo video)'}
                      </h3>
                      
                      {!item.isCreated && (
                         <div className="mt-4 pt-3 border-t border-gray-100">
                            <span className="text-xs font-semibold text-blue-600 flex items-center justify-center gap-1 group-hover:underline">
                               Tạo ngay <Wand2 size={12}/>
                            </span>
                         </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
               <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Search className="text-gray-400 w-8 h-8" />
               </div>
               <h3 className="text-gray-900 font-medium">Không tìm thấy kết quả</h3>
               <p className="text-gray-500 text-sm mt-1">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}