const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_AUTH_SECRET } = require("../config");

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        if(token){
            try {
                const decodedToken = jwt.verify(token, JWT_AUTH_SECRET);
                return decodedToken;
            } catch (err) {
                throw new AuthenticationError("Invalid/expired Token");
            }
        }
        throw new Error("Token must be provided 'Bearer token' format");
    }
    throw new Error("Authorization Header missing!");
}