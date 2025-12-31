const joi=require('joi');

const ListingSchema=joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().allow('',null),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required()
});
//module.exports=ListingSchema;
const reviewSchema=joi.object({
    rating:joi.number().required().min(1).max(5),
    comment:joi.string().required()
});
module.exports={ListingSchema,reviewSchema};