import express, {NextFunction, Request, Response} from "express";
import {deleteBookmark, getBookmarks, makeBookmark} from "./bookmarks.ts";
import {createComment, deleteComment, editComment} from "./comments.ts";
import {createLike, deleteLike} from "./likes.ts";

const router = express.Router()

router.get('/bookmark', getBookmarks)
router.post('/bookmark', makeBookmark)
router.delete('/bookmark/:id', deleteBookmark)

router.post('/comment', createComment)
router.delete('/comment/:id', deleteComment)
router.put('/comment/:id', editComment)

router.post('/like', createLike)
router.delete('/like/:id', deleteLike)

export const loggedInUserControllers = router