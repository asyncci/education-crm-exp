import express, {NextFunction, Request, Response} from "express";
import {getActiveBlogs, getBlog, getBlogsByCategory} from "./blog.ts";
import {getCategories, getCategory} from "./categories.ts";
import {getComment, getComments} from "./comments.ts";
import {getLikes} from "./likes.ts";

const router = express.Router()

router.get('', getActiveBlogs)
router.get('/:category', getBlogsByCategory)
router.get('/:id', getBlog)
router.get('/categories', getCategories)
router.get('/category/:id', getCategory)

router.get('/:blog', getComments)
router.get('/comment/:id', getComment)

router.get('/likes', getLikes)

export const publicBlogControllers = router