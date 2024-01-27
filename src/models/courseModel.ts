import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
    title: String,
    description: String,
    syllabus: String,
    files: [String],
    sessions_count: Number,
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile' },
    rating: Number,
    //link to photos
    final_gallery: [String],
    //payment
    payment: String,
    testimonials: [{ type: Schema.Types.ObjectId, ref: 'StudentReview'}],
    registered_students_count: Number,
    starting_date: Date,
})

const ActiveCourseSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course'},
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile'},
    students: [{ type: Schema.Types.ObjectId, ref: 'StudentProfile'}],
    status: { enum: ['enrollment', 'started', 'finished'] },
})

export const Course = model('Course', CourseSchema);
export const ActiveCourse = model('ActiveCourse', ActiveCourseSchema);