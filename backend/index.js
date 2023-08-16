import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'mongoose';
import connectDB from './src/config/dbConn.js'
import consumerRoutes from './src/routes/consumerRoutes.js';
import providerRoutes from './src/routes/providerRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js'
import requestRoutes from './src/routes/requestRoutes.js'
import reviewRoutes from './src/routes/reviewRoutes.js'
import jobTypeRoutes from './src/routes/jobTypeRoutes.js'


const { connection } = pkg;

dotenv.config();

const app = express()
// Parse JSON-encoded bodies
app.use(express.json({ limit: '25mb' }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors())
const mongoPort = 3005;
connectDB()



app.use(express.static('upload'))

// API routes
consumerRoutes(app);
providerRoutes(app);
jobRoutes(app);
reviewRoutes(app);
requestRoutes(app);
jobTypeRoutes(app);

// Connecting to MongoDB using mongoose
connection.once('open', () => {
    app.listen(mongoPort, () => {
        console.log('🔗 Successfully Connected to MongoDB')
        console.log(`✅ Application running on port: ${mongoPort}`);
    })
})
connection.on('error', (err) => {
    console.log(err)
})