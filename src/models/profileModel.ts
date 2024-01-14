import mongoose, { Schema, model } from "mongoose";
import { AcademicArea } from "./academicAreaModel";

let MentorSchema = new Schema({
    firstName: String,
    lastName: String,
    subject: [ { type: Schema.Types.ObjectId, ref: AcademicArea } ],
})

export const MentorProfile = model('MentorProfile', MentorSchema);

let StudentSchema = new Schema({
    firstName: String,
    lastName: String,
})

export const StudentProfile = model('StudentProfile', StudentSchema);
