import { createError } from "../../error.js";
import User from  "../../models/user.js"
import Video from "../../models/Video.js";
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await  newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video Not Found"));

    if (video.userId === req.user.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updateVideo);
    } else {
      return next(createError(403, "You can updated only your videos"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video Not Found"));

    if (video.userId === req.user.id) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("Video deleted Successfully");
    } else {
      return next(createError(403, "You can delete only your videos"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};
export const addView = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    console.log("pro")
    const video = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const video = await Video.find().sort({ views: -1 });
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    
  const user=await User.findById(req.user.id);
  const subscribedChannels=user.subscribedUsers;

  const list=await Promise.all(
    subscribedChannels.map((channelId)=>{
        return Video.find({userId:channelId})
    })
  )
  res.status(200).json(list.flat().sort((a,b)=>b.createdAt-a.createdAt))

  } catch (err) {
    next(err);
  }
};


export const getByTag = async (req, res, next) => {
    const tags=req.query.tags.split(",")
    try {

      const video = await Video.find({tags:{$in:tags}}).limit(20)
      res.status(200).json(video);
    } catch (err) {
      next(err);
    }
  };


export const search = async (req, res, next) => {
    const query=req.query.q
    try {
      const video = await Video.find({
        title:{$regex:query,$options:"i"}
      }).limit(20)
      res.status(200).json(video);
    } catch (err) {
      next(err);
    }
  };  
