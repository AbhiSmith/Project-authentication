import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    nmae : String,
    age : Number,

})
const Student = mongoose.model("Student",studentSchema);
export default Student;