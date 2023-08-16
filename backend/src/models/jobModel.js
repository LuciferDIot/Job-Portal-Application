import { Schema, model } from 'mongoose';
import { Provider } from './providerModel.js'

export const jobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'provider', required: true },
    price: { type: Number }
})

export const Job = model('job', jobSchema);