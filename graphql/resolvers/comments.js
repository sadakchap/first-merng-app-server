const { UserInputError, AuthenticationError } = require("apollo-server");
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
            const { postId, commentId } = args;
            const { username } = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if(!post){
                    throw new UserInputError("Post not Found!");
                }
                const commentIdx = post.comments.findIndex(comment => comment.id === commentId);
                if(commentIdx === -1){
                    throw new UserInputError("comment does not exists");
                }

                if(post.comments[commentIdx].username !== username){
                    throw new AuthenticationError("Unauthorizied Access Denied!");
                }
                
                post.comments.splice(commentIdx, 1);
                const res = await post.save();
                return res;

            } catch (err) {
                throw err;
            }
        }
    }
}