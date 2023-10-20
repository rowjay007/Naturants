/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import NaturantsModel from "./naturantsModel";

interface ReviewData extends Document {
  user: string;
  naturant: Types.ObjectId; // Change this line
  content: string;
  rating: number;
  createdAt: Date;
}

interface ReviewModel extends Model<ReviewData> {
  calculateAverageRating(naturantId: Types.ObjectId): Promise<number | null>;
}

const reviewSchema = new Schema<ReviewData>(
  {
    user: { type: Schema.Types.ObjectId as any, ref: "User", required: true },
    naturant: {
      type: Schema.Types.ObjectId as any,
      ref: "Naturants",
      required: true,
    },
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure a user can only have one review for a naturant
reviewSchema.index({ user: 1, naturant: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (
  naturantId: Types.ObjectId
): Promise<number | null> {
  const stats = await this.aggregate([
    {
      $match: { naturant: naturantId },
    },
    {
      $group: {
        _id: "$naturant",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await NaturantsModel.findByIdAndUpdate(naturantId, {
      averageRating: stats[0].avgRating,
      numRatings: stats[0].nRating,
    });
  } else {
    await NaturantsModel.findByIdAndUpdate(naturantId, {
      averageRating: null,
      numRatings: 0,
    });
  }

  return stats.length > 0 ? stats[0].avgRating : null;
};

const ReviewsModel = mongoose.model<ReviewData, ReviewModel>(
  "Review",
  reviewSchema
);

export default ReviewsModel;
