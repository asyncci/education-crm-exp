import {Request, Response} from "express";
import {Blog, Comment} from "../../models/blogModel.ts";

//get all
export async function getComments(req: Request, res: Response) {
    const comments = await Comment.find({blog: req.params.blog});
    return res.send({success: true, data: {comments: comments}})
}

//get one comment
export async function getComment(req: Request, res: Response) {
    const comment = await Comment.find({_id: req.params.id});
    return res.send({success: true, data: {comment: comment}})
}

//create comment
export async function createComment(req: Request, res: Response) {
    try {
        const comment = new Comment(req.body);
        const savedComment = await comment.save();

        await Blog.updateOne(
            { _id: savedComment.blog },
            { $inc: { comments: 1 } }
        );

        return res.status(201).send({ success: true, data: { comment: savedComment } });
    } catch (err) {
        console.log('Database error: ', err);
        return res.status(500).send({ success: false, message: "Database error, while saving `Comment`" });
    }
}

//delete comment
export async function deleteComment(req: Request, res: Response) {
    try {
        const comment = await Comment.findOne({ _id: req.params.id });

        if (!comment) {
            return res.status(404).send({ success: false, error: "Comment not found" });
        }

        if (!comment.author || comment.author.toString() !== res.locals.user._id.toString()) {
            return res.status(403).send({ success: false, error: "Unauthorized: User is not the author of the comment" });
        }

        await comment.deleteOne();
        await Blog.updateOne(
            { _id: comment.blog },
            { $inc: { comments: -1 } }
        );
        return res.send({ success: true, message: 'Comment deleted' });
    } catch (err) {
        console.log('Database error: ', err);
        return res.status(500).send({ success: false, error: "Database error deleting `Comment`" });
    }
}

//edit comment
export async function editComment(req: Request, res: Response) {
    try {
        const comment = await Comment.findOne({_id: req.params.id});

        if (!(!comment || !comment.author)) {
            const user = res.locals.user;
            if (comment.author.toString() !== user._id.toString()) {
                return res.status(403).send({success: false, error: "You are not authorized to edit this comment"});
            }
            const updatedComment = await Comment.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
            return res.status(200).send({success: true, message: 'Comment updated', data: {comment: updatedComment}});
        } else {
            return res.status(400).send({success: false, error: "Comment doesn't exist"});
        }
    } catch (error) {
        return res.status(500).send({success: false, error: "Internal server error"});
    }
}
