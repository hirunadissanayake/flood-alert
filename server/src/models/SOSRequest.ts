import mongoose, { Document, Schema } from 'mongoose';

export interface ISOSRequest extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'rescue' | 'food' | 'medicine' | 'evacuation';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'accepted' | 'completed';
  assignedVolunteer?: mongoose.Types.ObjectId;
  description?: string;
  timestamp: Date;
}

const sosRequestSchema = new Schema<ISOSRequest>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['rescue', 'food', 'medicine', 'evacuation'],
    required: [true, 'SOS type is required']
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
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  assignedVolunteer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ISOSRequest>('SOSRequest', sosRequestSchema);
