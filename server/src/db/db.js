// (Cloud) MongoDB connection

import mongoose from "mongoose"
import "dotenv/config"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\nMongoDB connected succesfully at DB host = ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log(`\nMongoDB connection failed\n`, error)
        process.exit(1)
    }
}

export default connectDB