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
    }
  }
};