import express, { NextFunction, Response, Request } from "express"
import { verify } from 'jsonwebtoken'
import { config } from "../config";
import { adminControllers } from "./controllers/adminControllers/controllers";
import { studentControllers } from "./controllers/studentControllers/controllers";

let router = express.Router()

function authorization(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization || req.body.authorization;

    if (token) {
        const verified = verify(token, config.secretKey)

        if (!verified) {
            return res.status(401).send({
                success: false,
                error: 'Failed to authenticate token'
            })
        }

        next()
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token'
        });
    }
}

router.use(authorization)

router.use('/admin', adminControllers)
router.use('/student', studentControllers)


export const privateRoutes = router;