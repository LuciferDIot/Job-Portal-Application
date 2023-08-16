import { Schema, model } from "mongoose";

export const reviewSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        provider: { type: Schema.Types.ObjectId, ref: 'provider', required: true },
        consumer: { type: Schema.Types.ObjectId, ref: 'consumer', required: true },
        rating: { type: Number, required: true },
        date: { type: Date }
    }
);

export const Review = model('review', reviewSchema);