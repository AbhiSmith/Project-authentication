import Student from '../models/Student.js'


export const createStudent = async (req, res) => {
   try {
    const { name, age } = req.body;
    const newStudent = new Student({ name, age });
    await newStudent.save();
    res.status(201).json(newStudent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
 
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findByIdAndRemove(id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
 
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;
        const student = await Student.findByIdAndUpdate(id, { name, age }, { new: true });
        res.json(student);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}