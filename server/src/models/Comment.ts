import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  reportId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
}

const commentSchema = new Schema<IComment>({
  reportId: {
    type: Schema.Types.ObjectId,
    ref: 'FloodReport',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
commentSchema.index({ reportId: 1, timestamp: -1 });

export default mongoose.model<IComment>('Comment', commentSchema);
