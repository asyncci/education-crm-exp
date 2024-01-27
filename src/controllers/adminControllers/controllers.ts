import express, { NextFunction, Request, Response, Router } from "express";
import { addAcademicArea, deleteAcademicArea } from "./curatorUtils";
import { User } from "../../models/userModel";
import { addCurator, deleteCurator } from "./curatorAccount";
import { changeStudentRequestStatus, getRequestsFromStudents, requestPayment } from "./projectManagement";
import { optimizeNextInvocation } from "bun:jsc";
import { createCourse } from "../courseControllers";

const router = express.Router()

async function checkCurator(req: Request, res: Response, next: NextFunction) {
    
    const auth = req.headers.authorization || req.body.authorization;
    const user = await User.findOne({ token: auth })
    
    if (!user)
        return res.status(400).send({ success: false, error: 'No user for such token' })

    if (user.role !== 'curator')
        return res.status(403).send({ success: false, error: "You are not `curator`" })

    res.locals.user = user
    next()
}

router.use(checkCurator)
/// add new curators, only curators can create curators
router.post('', addCurator)
router.delete('', deleteCurator)

/// utilities
router.post('/academicArea', addAcademicArea)
router.delete('/academicArea', deleteAcademicArea)

/// management
router.get('/classRequests',getRequestsFromStudents)
router.put('/classRequest', changeStudentRequestStatus)
router.post('/payment', requestPayment)

// create course
router.post('/course', createCourse)

export const adminControllers = router