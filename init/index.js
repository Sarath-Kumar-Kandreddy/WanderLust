const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');
const url='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
    console.log("connected to db");
    
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(url);
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,owner:'690cafa22341aba5557f68e6'
    }));
    await Listing.insertMany(initData.data);
    console.log("DB initialized with sample data");
}
initDB();