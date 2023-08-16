import { Schema, model } from 'mongoose';

const jobRequestSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    job: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Validate that the date is valid
                return !isNaN(value.getTime());
            },
            message: 'Invalid date',
        },
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'provider',
        required: true
    },
    consumer: {
        type: Schema.Types.ObjectId,
        ref: 'consumer',
        required: true
    },
    isAccepted: {
        type: String,
        required: true
    }
});

jobRequestSchema.virtual('time').get(function () {
    // Extract the time part from the date
    return this.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

jobRequestSchema.virtual('am_pm').get(function () {
    // Extract the AM/PM part from the date
    return this.date.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' }).slice(-2);
});

export const JobRequest = model('JobRequest', jobRequestSchema); 
