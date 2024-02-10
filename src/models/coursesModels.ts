import mongoose, { Schema, model } from "mongoose";

let GroupCourse = new Schema({
    academicArea: String,
    topic: String,
    description: String,
    syllabus: String, //not sure, maybe list of something,
    files: String,
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile' },
    gallery: [ String ]
})

let GroupClass = new Schema({
    groupCourse: { type: Schema.Types.ObjectId, ref: 'GroupCourse' },
    status: { type: String, enum: ['not_started', 'ongoing', 'finished'] },
    sessions_count : Number,
    starting_date: Date,
    finish_date: Date,
    students: [ { type: Schema.Types.ObjectId, ref: 'StudentProfile' } ],
    intake_gallery: [ String ],
    testimonials: [ { type: Schema.Types.ObjectId, ref: 'StudentTestimonial'} ],
    price: String,
})

let IndividualClass = new Schema({

})

///TODO: Zoom link
///TODO: Attendance



export const OneToOneClass = model('OneToOneClass', OngoingCourse);
