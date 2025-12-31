const { number, date } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
    const ReviewSchema = new Schema({   
        rating:{
            type:Number,
            min:1,
            max:5,
          //  required:true
        },
        comment:{
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now()
        },
        author:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    });

 const review=mongoose.model('Review',ReviewSchema);
    module.exports=review;
