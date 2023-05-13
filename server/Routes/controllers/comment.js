import { createError } from "../../error.js"
import Comment from "../Models/Comment.js"
import Video from "../Models/Video.js"

export const addComment=async(req,res,next)=>{
    const newcomment=new Comment({...req.body,userId:req.user.id})
    try{
      const savedComment=  await newcomment.save()
        res.status(200).send(savedComment)
    }
    catch(err)
    {
        next(err)
    }
}

export const deleteComment=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.id)
        const video=await Video.findById(req.params.id)

        if(req.user.id===comment.userId || video.userId===req.user.id){
            await Comment.findOneAndDelete(req.params.id)
            res.status(200).json("Comment has been deleted")
        }
        else{
            return next(createError(403,"You can deleted only your comments"))
        }

    }
    catch(err)
    {
        next(err)
    }
}

export const getComments=async(req,res,next)=>{
    try{
        const comments=await Comment.find({videoId:req.params.videoId})
        res.status(200).json(comments)
    }
    catch(err)
    {
        next(err)
    }
}