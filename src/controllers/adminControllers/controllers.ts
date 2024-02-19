<<<<<<<<< Temporary merge branch 1
import express, {NextFunction, Request, Response} from "express";
import {User} from "../../models/userModel";
import {addCurator, deleteCurator} from "./curatorAccount";
import {changeStudentRequestStatus, getRequestsFromStudents, requestPayment} from "./projectManagement";
import {getAllStudents} from "../studentControllers/profile";
import {
    createContactService,
    deleteContactService,
    editContactService
} from "../profileControllers/contactsManagementControllers";
import {courseRoutesForAdmins} from "../courseControllers/courseRoutesForAdmins.ts";
import {courseRoutesForAdminsAndMentors} from "../courseControllers/courseRoutesForAdminsAndMentors.ts";
import {
    courseRoutesAdminsMentorsStudentsWhoPaid
} from "../courseControllers/courseRoutesAdminsMentorsStudentsWhoPaid.ts";
import {addAcademicArea, deleteAcademicArea} from "../academicAreaControllers.ts";
import {addNewsAdmin, deleteNewsAdmin} from "./newsAdminAccount.ts";

const router = express.Router()

async function checkCurator(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization || req.body.authorization;
    const user = await User.findOne({token: auth})

    if (!user)
        return res.status(400).send({success: false, error: 'No user for such token'})

    if (user.role !== 'curator')
        return res.status(403).send({success: false, error: "You are not `curator`"})

    res.locals.user = user
    next()
}

router.use(checkCurator)
/// add new curators, only curators can create curators
router.post('', addCurator)
router.delete('', deleteCurator)

router.post('/blog_admin', addNewsAdmin)
router.delete('/blog_admin', deleteNewsAdmin)

/// utilities
router.post('/academicArea', addAcademicArea)
router.delete('/academicArea', deleteAcademicArea)

/// management
router.get('/classRequests',getRequestsFromStudents)
router.put('/classRequest', changeStudentRequestStatus)
router.post('/payment', requestPayment)

//get all student profiles
router.get('/students', getAllStudents)

//ContactServices: Instagram, Email, WeChat, etc.
router.post('/contactServices', createContactService)
router.put('/contactServices/:id', editContactService)
router.delete('/contactServices/:id', deleteContactService)

//group courses:
router.use('', courseRoutesForAdmins)
router.use('', courseRoutesForAdminsAndMentors)
router.use('', courseRoutesAdminsMentorsStudentsWhoPaid)

export const adminControllers = router