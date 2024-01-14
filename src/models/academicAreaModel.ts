import mongoose, { Schema, model } from "mongoose";

const AcademicAreaScheme = new Schema({
    title: String,
    description: String,
})

export const AcademicArea = model('AcademicArea', AcademicAreaScheme);