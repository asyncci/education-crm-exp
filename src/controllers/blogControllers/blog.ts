import {Request, Response} from "express";
import {Blog} from "../../models/blogModel.ts";

//get all
export async function getBlogs(req: Request, res: Response) {
    const blogs = await Blog.find({});
    return res.send({success: true, data: {blogs: blogs}})
}
//get all active blogs
export async function getActiveBlogs(req: Request, res: Response) {
    const blogs = await Blog.find({active: true});
    return res.send({success: true, data: {blogs: blogs}})
}

//get by category
export async function getBlogsByCategory(req: Request, res: Response) {
    const blogs = await Blog.find({category: req.params.category});
    return res.send({success: true, data: {blogs: blogs}})
}

//get one blog
export async function getBlog(req: Request, res: Response) {
    const blog = await Blog.find({_id: req.params.id});
    return res.send({success: true, data: {blog: blog}})
}

//create blog
export async function createBlog(req: Request, res: Response) {
    const blog = new Blog(req.body);
    return await blog
        .save()
        .then((obj) => res.status(201).send({success: true, data: {blog: obj}}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, message: "Database error, while saving `Blog`"})
        })
}

//delete blog
export async function deleteBlog(req: Request, res: Response) {
    return await Blog.deleteOne({_id: req.params.id})
        .then(() => res.send({success: true, message: 'Blog deleted'}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, error: "Database error deleting `Blog`"})
        })
}

//edit blog
export async function editBlog(req: Request, res: Response) {
    try {
        const blog = await Blog.findOne({_id: req.params.id});

        if (!blog) {
            return res.status(400).send({success: false, error: "Blog doesn't exist"});
        }

        const updatedBlog = await Blog.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});

        return res.status(200).send({success: true, message: 'Blog updated', data: {blog: updatedBlog}});
    } catch (error) {
        return res.status(500).send({success: false, error: "Internal server error"});
    }
}
