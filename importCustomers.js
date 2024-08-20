import mongoose from "mongoose";
import { Customer } from "./customer.model.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Clear the existing collection (optional)
        await Customer.deleteMany({});

        // Read the JSON file
        const data = fs.readFileSync('customers.json', 'utf-8');
        const customers = JSON.parse(data);

        // Insert the data into the database
        await Customer.insertMany(customers);
        console.log('Customers imported!');

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });