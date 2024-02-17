import mongoose from "mongoose";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    eventName: String,
    eventDate: Date,
    eventDescription: String,
    eventVenue: String,
    eventContact: String,
    eventTickets: [
        {
         
          isChecked: {
            type: Boolean,
            default: false,
          },
          uuid: {
            type: String,
            default: 'someDefaultUUID', // You can set your own default UUID value if needed
          },
        },
      ],
      username: {
        type: String,
        unique: true,
        default: function() {
          if (!this.username) {
            return `examiner_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          }
        }
      },
      password: {
        type: String,
        required: true,
        default: function() {
          if (!this.password) {
            return Math.random().toString(36).substring(2, 10);
          }
        },
        select: false, // Hide password from query results        
      },
})

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE* 24 * 60 * 60 * 1000,
  })
}

userSchema.methods.matchPassword = async function (password) {
  return password === this.password;   
}
export const User = mongoose.model("User", userSchema);