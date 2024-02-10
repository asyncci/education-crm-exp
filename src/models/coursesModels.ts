import mongoose, { Schema, model } from "mongoose";

//intake independent
let GroupCourse = new Schema({
    academicArea: String,
    topic: String,
    description: String,
    syllabus: String, //not sure, maybe list of something,
    files: [ String ],
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile' },
    gallery: [ String ]
})

//intake dependent
let GroupClass = new Schema({
    groupCourse: { type: Schema.Types.ObjectId, ref: 'GroupCourse' },
    status: { type: String, enum: ['not_started', 'ongoing', 'finished'] },
    starting_date: Date,
    finish_date: Date,
    sessions: [ { type: Schema.Types.ObjectId, ref: 'GroupClassSession' }],
    students: [ { type: Schema.Types.ObjectId, ref: 'StudentProfile' } ],
    intake_gallery: [ String ],
    testimonials: [ { type: Schema.Types.ObjectId, ref: 'StudentTestimonial'} ],
    price: String,
})

let GroupClassSession = new Schema({
    count: { default: 0, type: Number },
    objective: String,
    goal: String,
    attendace: [
        {
            student: { type: Schema.Types.ObjectId, ref: 'StudentProfile' },
            status: { type: String, enum: ['absent', 'present', 'excused'] }
        }
    ]
})

let IndividualClass = new Schema({

})

///TODO: Zoom link
///TODO: Sessions



export const OneToOneClass = model('OneToOneClass', OngoingCourse);
