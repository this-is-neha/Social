const express= require("express")
const route= express.Router()
const postCtrl=require("./posts.controller")
const uploader=require("../../middleware/uploader")
route.post('/create',uploader.array('media',2),postCtrl.createPost)
route.get('/all',postCtrl.all)
route.get('/user/:id',postCtrl.each)
route.post('/:id/like',  postCtrl.toggleLike);
route.get('/:id/delete', postCtrl.deletePost);


module.exports= route

