import {model, Schema} from "mongoose";
import {User} from "./userModel.ts";

let CategorySchema = new Schema({
    category: String
})
export const Category = model('Category', CategorySchema);

let BlogSchema = new Schema({
    category: [{type: Schema.Types.ObjectId, ref: Category}],
    title: String,
    date: Date,
    coverPhoto: String,
    active: Boolean,
    comments: Number,
    likes: Number,
    htmlContent: String
})
export const Blog = model('Blog', BlogSchema);


let CommentSchema = new Schema({
    blog: {type: Schema.Types.ObjectId, ref: Blog},
    author: {type: Schema.Types.ObjectId, ref: User},
    text: String,
    date: Date
})
export const Comment = model('Comment', CommentSchema);

let LikeSchema = new Schema({
    blog: {type: Schema.Types.ObjectId, ref: Blog},
    author: {type: Schema.Types.ObjectId, ref: User},
    date: Date
})
export const Like = model('Like', LikeSchema);

let BlogSharesSchema = new Schema({
    blog: {type: Schema.Types.ObjectId, ref: Blog},
    user: {type: Schema.Types.ObjectId, ref: User},
    socialMedia: String,
    date: Date
})
export const BlogShares = model('BlogShares', BlogSharesSchema);


let BookmarkSchema = new Schema({
    blog: {type: Schema.Types.ObjectId, ref: Blog},
    user: {type: Schema.Types.ObjectId, ref: User},
    date: Date
})
export const Bookmark = model('Bookmark', BookmarkSchema);


