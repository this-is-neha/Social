const postSvc = require("./posts.service")
const authSvc = require('../auth/auth.service')
const jwt = require('jsonwebtoken')
class PostController {
    createPost = async (req, res, next) => {
        try {
            const payload = postSvc.transformData(req)
            const post = await postSvc.create(payload)
            res.json({
                result: post,
                message: "Post crateed Successfully",
                meta: null
            })
        }
        catch (exception) {
            throw exception
        }
    }
    all = async (req, res, next) => {
        try {
            const postObj = await postSvc.getAll()
            res.json({
                result: postObj,
                message: "POst list Fetched",
                meta: null
            })
        }
        catch (exception) {
            throw exception
        }
    }
    each = async (req, res, next) => {
        try {
            const id = req.params.id;
            console.log("User Id ", id)
            const postObj = await postSvc.getByUserId({ user: id })
            res.json({
                result: postObj,
                message: "Posts of one user",
                meta: null
            })
        }
        catch (exception) {
            throw exception
        }
    }

    toggleLike = async (req, res, next) => {

        try {
           
            const authHeader = req.headers.authorization;
            console.log("Auth header is ", authHeader)
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Authorization header missing or invalid" });
            }

            const token = authHeader.split(' ')[1];
            console.log("token is ", token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await authSvc.findOneUser({ _id: decoded.sub });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }



            const postId = req.params.id;
            const userId = user._id;

            const post = await postSvc.toggleLike({ postId, userId });

            res.json({
                result: post,
                message: 'Like toggled',
                meta: null
            });

        }

        catch (exception) {
            next(exception);
        }
    };

deletePost=async(req,res,next)=>{
    try{
const id=req.params.id;
const postObj= await postSvc.delete(id)
res.json({ 
    result:postObj,
    message:"Post Deleted Successfully",
    meta:null
 })
    }
    catch(exception){
        throw exception
    }
}

}
const postCtrl = new PostController()
module.exports = postCtrl