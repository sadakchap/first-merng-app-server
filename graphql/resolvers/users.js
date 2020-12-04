const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { JWT_AUTH_SECRET } = require("../../config");
const { validateRegisterInput, validateLoginInput } = require("../../utils/validators");

const generateAuthToken = (user) => {
  const payload = { userId: user._id, email: user.email, username: user.username }
  const token = jwt.sign(payload, JWT_AUTH_SECRET, {
    expiresIn: '1d'
  });
  return token;
}

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
        const token = generateAuthToken(res);
        return {
          ...res._doc,
          id: res._id,
          token
        }
      } catch (err) {
        console.log(err); 
        return err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      const { errors, valid } = validateLoginInput(username, password);
      if(!valid){
        throw new UserInputError("Errors", { errors });
      }
      try {
        const user = await User.findOne({ username });
        if(!user){
          errors.general = "User not Found!";
          throw new UserInputError("User not Found", { errors });
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
          errors.general = "Wrong credentials!";
          throw new UserInputError("Wrong credentials!", { errors });
        }
        const token = generateAuthToken(user);
        return {
          ...user._doc,
          id: user._id,
          token
        }
      } catch (err) {
        throw err;
      }
    }
  },
};