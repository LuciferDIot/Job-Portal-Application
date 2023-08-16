import { Schema, model } from 'mongoose';

export const JobSchema = new Schema({
    name: { type: String, unique: true }
})

export default model('jobType', JobSchema);