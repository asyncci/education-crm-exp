import mongoose, { Schema, model } from "mongoose";

//intake independent
let GroupCourseSchema = new Schema({
    academicArea: String,
    topic: String,
    description: String,
    syllabus: String, //not sure, maybe list of something,
    files: [ String ],
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile' },
    gallery: [ String ]
})

//intake dependent
let GroupClassSchema = new Schema({
    groupCourse: { type: Schema.Types.ObjectId, ref: 'GroupCourse' },
    status: { type: String, enum: ['not_started', 'ongoing', 'finished'] },
    starting_date: Date,
    finish_date: Date,
    sessions: [ { type: Schema.Types.ObjectId, ref: 'GroupClassSession' }],
    students: [ { type: Schema.Types.ObjectId, ref: 'StudentProfile' } ],
    intake_gallery: [ String ],
    testimonials: [ { type: Schema.Types.ObjectId, ref: 'StudentTestimonial'} ],
    price: String,
    receipt: String,
    paypal: String, // blank for feature
    visa: String, // blank for feature
})

let GroupClassSessionSchema = new Schema({
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

export const GroupCourse = model('GroupCourse', GroupCourseSchema);
export const GroupClass = model('GroupClass', GroupClassSchema);
export const GroupClassSession = model('GroupClassSession', GroupClassSessionSchema);

let IndividualClassRequestSchema = new Schema({
    description: String,
    first_interview: { type: Schema.Types.ObjectId, ref: 'Interview'},
    second_interview: { type: Schema.Types.ObjectId, ref: 'Interview'},
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile'},
    status: { type: String, enum: ['approved', 'declined', 'pending'], default: 'pending' },
})

let InterviewSchema = new Schema({
    passed: { type: Boolean, default: false },
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile'},
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile'},
    date: Date,
})

let IndividualClassSchema = new Schema({
    request: { type: Schema.Types.ObjectId, ref: 'IndividualClassRequest' },
    academic_area: { type: Schema.Types.ObjectId, ref: 'AcademicArea'},
    topic: String,
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile'},
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile'},
    sessions: [ { type: Schema.Types.ObjectId, rstatusef: 'IndividualClassSession'} ]
})

let IndividualClassSessionSchema = new Schema({
    class: { type: Schema.Types.ObjectId, ref: 'IndividualClass'},
    start_time: Date,
    session_files: [ String ],
    homework: String,
    homework_status: { type: String, enum: ['submited', 'unsubmited'], default: 'unsubmited'},
})

let ContractSchema = new Schema({
    receipt: String,
    proof: String,
    request: { type: Schema.Types.ObjectId, ref: 'IndividualClassRequest'},
    status: { type: String, enum: ['approved', 'declined', 'pending'], default: 'pending' },
    student: { type: Schema.Types.ObjectId, ref: 'StudentProfile'},
})

export const IndividualClassRequest = model('IndividualClassRequestSchema', IndividualClassRequestSchema);
export const Interview = model('InterviewSchema', InterviewSchema);
export const IndividualClass = model('IndividualClassSchema', IndividualClassSchema);
export const IndividualClassSession = model('IndividualClassSessionSchema', IndividualClassSessionSchema);
export const Contract = model('Contract', ContractSchema);

///TODO: Zoom link
///TODO: Sessions



