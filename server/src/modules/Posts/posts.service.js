const postModel = require("./posts.model")
const slugify = require("slugify")
class PostService {
    transformData = (req) => {
        const payload = req.body
        const files = req.files;

        payload.slug = slugify(payload.title, { lower: true })
        return ({
            user: payload.user,
            title: payload.title,
            media: files?.map(file => file.filename) || [],
            content: payload.content,
            location: payload.location,
            visibility: payload.visibility,
            tags: typeof payload.tags === 'string'
                ? payload.tags.split(',').map(t => t.trim())
                : payload.tags || []


        })
    }
    create = async (data) => {
        try {
            const postObj = new postModel(data)
            return await postObj.save()
        }
        catch (exception) {
            throw exception
        }
    }
    getAll = async () => {
        try {
            const postObj = await postModel.find()
            return postObj

        }
        catch (exception) {
            throw exception
        }
    }

    getByUserId = async (filter) => {
        try {
            const postObj = await postModel.find(filter)
            return postObj
        }
        catch (exception) {
            throw exception
        }
    }
    toggleLike = async ({ postId, userId }) => {
        const post = await postModel.findById(postId);
        if (!post) throw new Error('Post not found');
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        return post;
    };
    
    delete=async(id)=>{
        try {
            const postObj = await postModel.findByIdAndDelete(id)
            return postObj
        }
        catch (exception) {
            throw exception
        }
    }
}
const postSvc = new PostService()
module.exports = postSvc