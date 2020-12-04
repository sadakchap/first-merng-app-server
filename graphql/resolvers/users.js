const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { JWT_AUTH_SECRET } = require("../../config");
const { validateRegisterInput } = require("../../utils/validators");


module.exports = {
  Mutation: {
    register: async (_, args, context, info) => {
      const { registerInput: { email, username, password, confirmPassword } } = args;
      // validate user data
      // check for existing user
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid){
        throw new UserInputError("Errors", { errors });
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