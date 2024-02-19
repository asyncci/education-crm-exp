import {Request, Response} from "express";
import {Blog, Like} from "../../models/blogModel.ts";

//get all
export async function getLikes(req: Request, res: Response) {
    const likes = await Like.find({blog: req.params.blog});
    return res.send({success: true, data: {likes: likes}})
}


//like a blog
export async function createLike(req: Request, res: Response) {
    try {
        const like = new Like(req.body);
        const savedLike = await like.save();

        // Update blog's likes number
        await Blog.updateOne(
            { _id: savedLike.blog },
            { $inc: { likes: 1 } }
        );

        return res.status(201).send({ success: true, data: { like: savedLike } });
    } catch (err) {
        console.log('Database error: ', err);
        return res.status(500).send({ success: false, message: "Database error, while saving `Like`" });
    }
}

//delete like
export async function deleteLike(req: Request, res: Response) {
    try {
        const like = await Like.findOne({ _id: req.params.id });

        if (!like || !like.author) {
            return res.status(404).send({ success: false, error: "Like not found" });
        }

        if (like.author.toString() !== res.locals.user._id.toString()) {
            return res.status(403).send({ success: false, error: "Unauthorized: User did not like this item" });
        }

        // User is the author, delete the comment
        await like.deleteOne();
        await Blog.updateOne(
            { _id: like.blog },
            { $inc: { likes: -1 } }
        );
        return res.send({ success: true, message: 'Like deleted' });
    } catch (err) {
        console.log('Database error: ', err);
        return res.status(500).send({ success: false, error: "Database error deleting `Like`" });
    }
}

