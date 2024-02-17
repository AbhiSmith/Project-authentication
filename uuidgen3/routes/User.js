import express from "express"
import { createEvent, login, logout, searchTicket, searchTicketForUser, updateTicket } from "../controllers/User.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.route("/genTicket").post(createEvent)
router.route("/login").post(login)
router.route("/logout").get(isAuthenticated, logout)
router.route("/checkTicket/:ticketId").put(isAuthenticated, updateTicket)
// Route to search event tickets by UUID
router.route("/getTicket/:uuid").get(isAuthenticated, searchTicket)
// Define a route to search event tickets by UUID for a particular user
router.route("/eventTickets/:uuid").get(isAuthenticated, searchTicketForUser)



export default router;