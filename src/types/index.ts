export type Vendor = {
  _id: string;
  name?: string;
  businessName?: string;
  image?: string | null;
};

export type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorId: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  vendor?: Vendor;
  isPremium?: boolean;
};

export type ServicesResponse = {
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
};