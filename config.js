require("dotenv").config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.e9lgd.mongodb.net/${process.env.MONGO_DB_NAME}`;
const JWT_AUTH_SECRET=process.env.JWT_AUTH_SECRET

module.exports = {
    MONGO_URL,
    JWT_AUTH_SECRET
}