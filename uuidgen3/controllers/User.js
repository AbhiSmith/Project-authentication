import { User } from "../models/ticketGenDB.js";
import { v4 as uuidv4 } from 'uuid';
import { sendToken } from '../utils/sendToken.js'

export const createEvent = async (req, res) => {
    try {
        const { eventName, eventDate, eventDescription, eventVenue, eventContact, ticketCount} = req.body;
        
        if (!eventName || !eventDate || !eventDescription || !eventVenue || !eventContact || !ticketCount) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (!ticketCount || isNaN(ticketCount) || ticketCount <=0 ) {
            return res.status(400).json({ success: false, message: "Invalid or missing eventTickets parameter" });
        }

        // Generate UUIDs for eventTickets
        const uuids = [];
        for (let i = 0; i < ticketCount; i++) {
            const uuid = uuidv4();
            uuids.push(uuid);
        }

        const eventTicketsWithUUID = uuids.map(
            (uuid, index) => ({ ...ticketCount[index], uuid }) // Add UUID to each eventTicket object
          )
      
          // Create new ticket document
          const newTicket = new User({
            eventName,
            eventDate,
            eventDescription,
            eventVenue,
            eventContact,
            eventTickets: eventTicketsWithUUID, // Add UUIDs to eventTickets array
        });

        // Save ticket to database
      const savedTicket = await newTicket.save();
  
      // Send response
      res.json(savedTicket);

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Something went wrong", });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }
        const user = await User.findOne({ username }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }
        sendToken(res, user, 200, "User logged in successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Something went wrong", });
    }
}

export const logout = async(req, res) => {
    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
        }).json({
            success: true,
            message: "Logged out",
        }); 
    
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Something went wrong", });
    }
}
// export const searchTicketForUser = async (req, res) => {
//     try {
//         const { uuid } = req.params;
        
//         // const ticket = await User.findOne(req.user.uuid);
//         // Find the user with the provided UUID from req.user
//         const ticket  = await User.findOne({ uuid: req.user.uuid });
//          console.log(ticket)
//         if (!ticket) {
//             return res.status(404).json({ success: false, message: "Ticket not found" });
//         }
//         const eventTicket = ticket.eventTickets.find(
//             (ticket) => ticket.uuid === uuid
//         );
//         if (!eventTicket) {
//             return res.status(404).json({ success: false, message: "Ticket not found" });
//         }
//         if (eventTicket.isChecked) {
//             return res.status(400).json({ message: "Ticket already checked in" });
//           }
//           eventTicket.isChecked = true;

//           await ticket.save();
//           res.status(200).json({ success: true, message: "Welcome" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({success: false, message: "Something went wrong", });
//     }
// }




export const updateTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;        
        
        // const ticket = await User.findById(req.user._id);
        const ticket = await User.findOne({ "eventTickets._id": ticketId });

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        // Search for the ticket within eventTickets array
      const eventTicket = ticket.eventTickets.find(
        (ticket) => ticket._id.toString() === ticketId
      );  
      if (!eventTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (eventTicket.isChecked) {
        return res.status(400).json({ message: "Ticket already checked in" });
      }
      eventTicket.isChecked = true;
      await ticket.save();
      res.status(200).json({ success: true, message: "Welcome" });
  
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Something went wrong", });
    }
}

// Route to search update event tickets by UUID
export const searchTicket = async (req, res) => {
    try {
        const { uuid } = req.params;
        const ticket = await User.findOne({ "eventTickets.uuid": uuid });
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        const eventTicket = ticket.eventTickets.find(
            (ticket) => ticket.uuid === uuid
        );
        if (!eventTicket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        if (eventTicket.isChecked) {
            return res.status(400).json({ message: "Ticket already checked in" });
          }
          eventTicket.isChecked = true;

          await ticket.save();
          res.status(200).json({ success: true, message: "Welcome" });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Something went wrong", });
    } 
}

// Route to search event tickets by UUID for a specific event
// Define a route to search event tickets by UUID for a particular user
export const searchTicketForUser = async (req, res) => {
    try {
      const userId = req.user._id
      const uuid = req.params.uuid;

      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the event ticket with the specified UUID for the user
      const eventTicket = user.eventTickets.find(ticket => ticket.uuid === uuid);
  
      if (!eventTicket) {
        return res.status(404).json({ message: 'Event ticket not found' });
      }
      if (eventTicket.isChecked) {
            return res.status(400).json({ message: "Ticket already checked in" });
        }
                  
        eventTicket.isChecked = true;
        
                  
        await user.save();
                  
        res.status(200).json({ success: true, message: "Welcome" });
  
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }