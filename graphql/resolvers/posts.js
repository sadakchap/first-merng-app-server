const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    getPost: async (_, args) => {
      const { postId } = args;
      try {
        const post = await Post.findById(postId).sort('-createdAt');
        if(!post){
          throw new Error('Post not Found');
        }
        return post;
      } catch (err) {
        throw err;
      }
    }
  },
  Mutation: {
    createPost: async(_, args, context) => {
      const { body } = args;
      const user = checkAuth(context);
      if(body.trim() === ''){
        throw new UserInputError("Post body must NOT be empty!");
      }
      const post = new Post({
        body,
        user: user.userId,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      try {
        const savedPost = await post.save();
        return savedPost;
      } catch (err) {
        throw new Error("eheheh")
      }
    },
    deletePost: async (_, args, context) => {
      const { postId } = args;
      try {
        const post = await Post.findById(postId);
        if(!post){
          throw new Error("Post not Found!");
        }
        const user = checkAuth(context);
        if(user.username !== post.username ){
          throw new AuthenticationError("Unauthorized Access Denied!");
        }
        
        await post.delete();
        return `Post deleted successfully!`;

      } catch (err) {
        throw err;
      }
    },
    likePost: async (_, args, context) => {
      const { postId } = args;
      const { username } = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if(!postId){
          throw new UserInputError("Post not Found!");
        }
        const postIdx = post.likes.findIndex(like => like.username === username);
        if(postIdx === -1){
          // Not liked, add like
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }else{
          // already liked, remove it
          post.likes = post.likes.filter(like => like.username !== username);
        }
        const res = await post.save();
        return res;
      } catch (err) {
        throw err;
      }
    }
  }
};