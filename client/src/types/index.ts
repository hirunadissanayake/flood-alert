export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  isSafe: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FloodReport {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  waterLevel: 'low' | 'medium' | 'high' | 'severe';
  description: string;
  imageUrl?: string;
  status: 'pending' | 'verified';
  timestamp: Date;
}

export interface SOSRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  type: 'rescue' | 'food' | 'medicine' | 'evacuation';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'accepted' | 'completed';
  assignedVolunteer?: {
    _id: string;
    name: string;
  };
  description?: string;
  timestamp: Date;
}

export interface Shelter {
  _id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  phone: string;
  facilities?: string[];
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}
