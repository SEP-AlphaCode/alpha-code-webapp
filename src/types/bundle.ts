// Kiểu dữ liệu cơ bản API
export type Bundle = {
    id: string;
    name: string;
    description: string; 
    price: number;
    discountPrice: number;
    coverImage: string;
    statusText: string;
    status: number;
    lastUpdated: string;
    createdDate: string
}


export type BundleModal = {
  id?: string;
  name: string;
  description: string;
  price: number;  
  discountPrice?: number;
  status?: number;
  coverImage?: string | null;
  image?: File | null;
};
