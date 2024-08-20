import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({
    first_name: { 
        type: String, 
        required: true 
    },
    last_name: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    company: { 
        type: String, 
        required: true 
    }
}, {timestamps: true})

export const Customer = mongoose.model('Customer', customerSchema)