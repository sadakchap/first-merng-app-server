const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_AUTH_SECRET } = require("../../config");
const { UserInputError } = require("apollo-server");

module.exports = {
  Mutation: {
    register: async (_, args, context, info) => {
      const { registerInput: { email, username, password, confirmPassword } } = args;
      // validate user data
      // check for existing user
      if(password !== confirmPassword){
        throw new Error("Passwords don't match!");
      }
      try {
        const user = await User.findOne({ username });
        if(user){
          throw new UserInputError('Username is taken', {
            errors: {
              username: "This username is taken"
            }
          });
        }
        hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
          email,
          username,
          password: hashedPassword,
          createdAt: new Date().toISOString()
        });
        const res = await newUser.save();
        const payload = { userId: res._id, email: res.email, username: res.username }
        const token = jwt.sign(payload, JWT_AUTH_SECRET, {
          expiresIn: '1d'
        });
        return {
          ...res._doc,
          id: res._id,
          token
        }
      } catch (err) {
        console.log(err); 
        return err;
      }
    }
  },
};