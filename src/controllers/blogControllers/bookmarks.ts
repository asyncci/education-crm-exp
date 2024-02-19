import {Request, Response} from "express";
import {Bookmark} from "../../models/blogModel.ts";

//get all
export async function getBookmarks(req: Request, res: Response) {
    const bookmarks = await Bookmark.find({user: res.locals.user});
    return res.send({success: true, data: {bookmarks: bookmarks}})
}


//make bookmark
export async function makeBookmark(req: Request, res: Response) {
    const { blog } = req.body;
    const userId = res.locals.user._id;
    const date = new Date();

    const bookmark = new Bookmark({
        blog: blog,
        user: userId,
        date: date
    });
    return await bookmark
        .save()
        .then((obj) => res.status(201).send({success: true, data: {category: obj}}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, message: "Database error, while saving `Bookmark`"})
        })
}

//delete bookmark
export async function deleteBookmark(req: Request, res: Response) {
    return await Bookmark.deleteOne({_id: req.params.id})
        .then(() => res.send({success: true, message: 'Bookmark deleted'}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, error: "Database error deleting `Bookmark`"})
        })
}

