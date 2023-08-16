import { Schema, model } from 'mongoose';

const providerSchema = new Schema({
    availability: { type: String, default: "Full time" },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    street: { type: String },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    qualification: { type: Schema.Types.ObjectId, ref: 'jobType', required: true },
    experience: { type: String, default: "0" },
    rate: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    review: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false, required: true }
});

export const Provider = model('provider', providerSchema);