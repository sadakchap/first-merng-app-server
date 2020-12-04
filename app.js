require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGO_URL } = require("./config");

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;
 
// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    sayHi: () => 'Hi John, there!!!!',
  },
};
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(conn => {
    console.log(`😍 DB CONNECTED AT ${conn.connection.port}`);
    server.listen(8000).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}).catch(err => {
    console.log(err);
    console.log("DB CONNECTION FAILED 🤪🤪");
    process.exit(1);
});