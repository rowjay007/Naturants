/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import NaturantsModel from "./naturantsModel";

interface ReviewData extends Document {
  user: Types.ObjectId | any;
  naturant: Types.ObjectId | any;
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

reviewSchema.index({ user: 1, naturant: 1 }, { unique: true });
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
    const naturant = await NaturantsModel.findById(naturantId).populate({
      path: "reviews",
      populate: {
        path: "user",
        model: "User",
      },
    });

    if (naturant) {
      naturant.ratingsAverage = stats[0].avgRating;
      naturant.numRatings = stats[0].nRating;
      await naturant.save();
    }
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
