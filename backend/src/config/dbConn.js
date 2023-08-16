import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.Promise = global.Promise;
    const URL = 'mongodb://0.0.0.0:27017/CRMdb';
    try {
        return mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        console.log(err)
    }
    return null;
}
export default connectDB;