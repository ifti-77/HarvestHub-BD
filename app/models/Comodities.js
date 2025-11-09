import mongoose from "mongoose";


const CommoditySchema = new mongoose.Schema({
    uniqueID:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    division:{type:String, required:true},
    price:[{date: String, rate: Number, unit: String}],
    updatedDate:{type:String, required: true}
})
export default mongoose.models.Comodities || mongoose.model("Comodities",CommoditySchema)