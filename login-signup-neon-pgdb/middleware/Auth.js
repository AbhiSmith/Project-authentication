import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        const isCustomAuth = token.length < 500; // check if true then they are coustom token else google oAuth
        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
        }
        else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub; // google specific id diffenciate user
        }
        next();      
       
    }
    catch (error) {
        res.status(401).json({ message: 'Auth failed' });
    }
}
export default isAuthenticated;