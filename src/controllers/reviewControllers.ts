import { Request, Response } from "express";
import { StudentTestimonial } from "../models/reviewModel";

//get all - public method
export async function getReviews (req: Request, res: Response) {
    const reviews = await StudentTestimonial.find({});
    return res.send({ success: true, data: { reviews: reviews } })
}

//need to create a method get reviews by course. When we decide how to link courses and reviews.

//get one review - this is a public method
export async function getReview(req: Request, res: Response) {
    const review = await StudentTestimonial.find({ _id: req.params.id });
    return res.send({ success: true, data: { review: review } })
}

//create review - for students only
export async function createReview(req: Request, res: Response) {
    const newReview = new StudentTestimonial(req.body);
    return await newReview
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { newReview: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `StudentTestimonial`" })
        })
}

//delete Review - for students, admins, mentors - located in privateRoutes.ts. Students can delete only their own review.
export async function deleteReview(req: Request, res: Response) {
    const user = res.locals.user;
    const loggedInUserRole = user.role;

    if (loggedInUserRole === 'student') {
        const review = await StudentTestimonial.findById(req.params.id);
        if (!review) {
            return res.status(404).send({ success: false, error: 'Review not found' });
        }

        if (!review.student || review.student.toString() !== user.profile.toString()) {
            return res.status(403).send({ success: false, error: 'You are not authorized to delete this review' });
        }
    }
    return await StudentTestimonial.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'Review was deleted' }))
        .catch((err) => {
            console.log('Database error: ', err);
            return res.status(500).send({ success: false, error: "Database error deleting review" });
        });
}

//edit Review - for students
export async function editReview(req: Request, res: Response) {
    return await StudentTestimonial.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'Review was updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "Review doesn't exist" })
        })
}