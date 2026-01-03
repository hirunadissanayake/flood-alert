import mongoose, { Document, Schema } from 'mongoose';

export interface IFloodReport extends Document {
  userId: mongoose.Types.ObjectId;
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

const floodReportSchema = new Schema<IFloodReport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  waterLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'severe'],
    required: [true, 'Water level is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location queries
floodReportSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export default mongoose.model<IFloodReport>('FloodReport', floodReportSchema);
