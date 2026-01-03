import mongoose, { Document, Schema } from 'mongoose';

export interface IShelter extends Document {
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
  createdAt: Date;
}

const shelterSchema = new Schema<IShelter>({
  name: {
    type: String,
    required: [true, 'Shelter name is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 0
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    }
  },
  phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  facilities: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IShelter>('Shelter', shelterSchema);
