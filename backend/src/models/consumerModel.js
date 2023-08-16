import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String },
    street: { type: String },
    country: { type: String, required: true },
    zip: { type: String, required: true },
    isActive: { type: Boolean, default: false, required: true }

})
export const Consumer = mongoose.model('consumer', userSchema)