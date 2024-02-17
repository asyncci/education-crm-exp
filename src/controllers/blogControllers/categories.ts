import {Request, Response} from "express";
import {Category} from "../../models/blogModel.ts";

//get all
export async function getCategories(req: Request, res: Response) {
        const categories = await Category.find({});
    return res.send({success: true, data: {categories: categories}})
}

//get one category
export async function getCategory(req: Request, res: Response) {
    const category = await Category.find({_id: req.params.id});
    return res.send({success: true, data: {category: category}})
}

//create category
export async function createCategory(req: Request, res: Response) {
    const category = new Category(req.body);
    return await category
        .save()
        .then((obj) => res.status(201).send({success: true, data: {category: obj}}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, message: "Database error, while saving `Category`"})
        })
}

//delete category
export async function deleteCategory(req: Request, res: Response) {
    return await Category.deleteOne({_id: req.params.id})
        .then(() => res.send({success: true, message: 'Category deleted'}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, error: "Database error deleting `Category`"})
        })
}

//edit category
export async function editCategory(req: Request, res: Response) {
    return await Category.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({success: true, message: 'Category updated', data: {course: doc}})
            else
                return res.status(400).send({success: false, error: "Category doesn't exist"})
        })
}