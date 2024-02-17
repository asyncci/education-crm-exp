import mongoose, { Schema, model } from "mongoose";

let GroupCourse = new Schema({
    academicArea: String,
    topic: String,
    description: String,
    syllabus: String, //not sure, maybe list of something,
})

let GroupClass = new Schema({
    groupCourse: { type: Schema.Types.ObjectId, ref: 'G' },
    status: { type: String, enum: ['not_started', 'ongoing', 'finished'] },
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile' },
    students: [ { type: Schema.Types.ObjectId, ref: 'StudentProfile' } ]
})

