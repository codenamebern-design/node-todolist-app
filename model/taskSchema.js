import mongoose from "mongoose";

//! Schema

const taskSchema = new mongoose.Schema(
    {
        task:{
            type:String,
            required:true
        },
        date:{
            type:String,
            required:true
        }

    },
    {
        timestamps:true
    }
)

//! Model
const TASK = mongoose.model('TASK',taskSchema)

export default TASK