require("dotenv").config();

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.e9lgd.mongodb.net/${process.env.MONGO_DB_NAME}`;

module.exports = {
    MONGO_URL
}