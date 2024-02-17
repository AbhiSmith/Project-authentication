export const sendToken = (res, user, statusCode, message) => {
    const token = user.getJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    const userData = {
        _id: user._id,
        username: user.username,
        eventTickets: user.eventTickets,
    }
    res.status(statusCode).cookie("token",token,options).json({ success: true, message, user: userData})

}