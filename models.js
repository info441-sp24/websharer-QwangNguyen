import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")
await mongoose.connect("mongodb+srv://quang413:quang413@hw3.fce3p3g.mongodb.net/?retryWrites=true&w=majority&appName=HW3")

console.log("successfully connected to mongodb")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    username: String,
    likes: [String],
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)

console.log("mongoose model post created")

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: String,
    created_date: Date
})

models.Comment = mongoose.model('Comment', commentSchema)

console.log("mongoose model comment created")

const userSchema = new mongoose.Schema({
    username: String,
    song: String,
    age: String,
    bio: String,
    animal: String,
})

models.User = mongoose.model('User', userSchema)

console.log("mongoose model user created")

export default models