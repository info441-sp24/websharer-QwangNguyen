import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")
//TODO: Add your mongoDB connection string (mongodb+srv://...)
await mongoose.connect("mongodb+srv://quang413:quang413@hw3.fce3p3g.mongodb.net/?retryWrites=true&w=majority&appName=HW3")

console.log("successfully connected to mongodb")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    created_date: String
})

models.Post = mongoose.model('Post', postSchema)

console.log("mongoose models created")

export default models