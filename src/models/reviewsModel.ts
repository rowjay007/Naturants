/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model, Schema } from "mongoose";

interface ReviewData extends Document {
  user: string;
  content: string;
  rating: number;
  createdAt: Date;
}

interface ReviewModel extends Model<ReviewData> {}

const reviewSchema = new Schema<ReviewData>(
  {
    user: { type: Schema.Types.ObjectId as any, ref: "User", required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ReviewsModel = mongoose.model<ReviewData, ReviewModel>(
  "Review",
  reviewSchema
);

export default ReviewsModel;
