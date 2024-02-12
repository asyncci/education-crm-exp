import express, {NextFunction, Request, Response} from "express";
import {groupClass, groupClasses} from "./groupClasses.ts";
import {groupClassSession, groupClassSessions} from "./GroupClassSessions.ts";
import {StudentTestimonial} from "../../models/reviewModel.ts";
import {User} from "../../models/userModel.ts";
import {GroupClass} from "../../models/coursesModels.ts";

const router = express.Router()

router.get('/group_class', groupClasses)

router.get('/group_session', groupClassSessions)
router.get('/group_session/:id', groupClassSession)


const checkStudentAccess = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    if (user.role === 'student') {
        const groupClassId = req.params.id;
        try {
            const groupClass = await GroupClass.findById(groupClassId);
            if (!groupClass) {
                return res.status(404).json({ success: false, error: 'Group class not found' });
            }

            if (!groupClass.students.includes(user.profile.toString())) {
                return res.status(403).json({ success: false, error: 'You are not authorized to access this group class' });
            }
        } catch (error) {
            console.error('Error checking student access:', error);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
    next();
};
router.use(checkStudentAccess)

router.get('/group_class/:id', groupClass)



export const courseRoutesAdminsMentorsStudentsWhoPaid = router;



