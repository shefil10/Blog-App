import { model, Schema } from "mongoose";

const BlogSchema= new Schema(
    {
        title:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
        author:{
            type:String,
            required:true,
        },  
    },
    {timestamps:true},
);
 const Blog = model("Blog",BlogSchema);
 export default Blog;