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

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type BookingParty = {
  name?: string;
  email?: string;
  image?: string | null;
  businessName?: string;
};

export type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  service?: {
    _id?: string;
    serviceName?: string;
    category?: string;
    price?: number;
    location?: string;
    image?: string;
  };
  vendor?: BookingParty;
  customer?: BookingParty;
};