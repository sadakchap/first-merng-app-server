const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
    Mutation: {
        createComment: async (_, args, context) => {
            const { postId, body } = args;
            const user = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: 'Comment must NOT bew empty!'
                    }
                });
            }
            try {
                const post = await Post.findById(postId);
                if(!post){
                    throw new Error("Post not Found!");
                }
                const comment = {
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                }

                post.comments.unshift(comment);
                const res = await post.save();
                return res;
                
            } catch (err) {
                throw err;
            }
        },
        deleteComment: async (_, args, context) => {

        }
    }
}