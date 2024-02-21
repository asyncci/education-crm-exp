import express, {NextFunction, Request, Response} from "express";
import {User} from "../../models/userModel.ts";
import {createBlog, deleteBlog, editBlog, getBlogs} from "./blog.ts";
import {createCategory, deleteCategory, editCategory} from "./categories.ts";

const router = express.Router()

async function checkCurator(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization || req.body.authorization;
    const user = await User.findOne({token: auth})

    if (!user)
        return res.status(400).send({success: false, error: 'No user for such token'})

    if (user.role !== 'curator' && user.role !== 'blog_admin')
        return res.status(403).send({success: false, error: "You are not authorized to edit blog"})

    res.locals.user = user
    next()
}

router.use(checkCurator)

router.get('', getBlogs)
router.post('', createBlog)
router.delete('/:id', deleteBlog)
router.put('/:id', editBlog)

router.post('/category', createCategory)
router.delete('/category/:id', deleteCategory)
router.put('/category/:id', editCategory)


export const blogControllers = router
