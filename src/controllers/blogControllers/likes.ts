import {Request, Response} from "express";
import {Like} from "../../models/blogModel.ts";

//get all
export async function getLikes(req: Request, res: Response) {
    const likes = await Like.find({blog: req.params.blog});
    return res.send({success: true, data: {likes: likes}})
}


//like a blog
export async function createLike(req: Request, res: Response) {
    const like = new Like(req.body);
    return await like
        .save()
        .then((obj) => res.status(201).send({success: true, data: {category: obj}}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, message: "Database error, while saving `Like`"})
        })
}

//delete like
export async function deleteLike(req: Request, res: Response) {
    return await Like.deleteOne({_id: req.params.id})
        .then(() => res.send({success: true, message: 'Like deleted'}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, error: "Database error deleting `Like`"})
        })
}

