const jwt = require("jsonwebtoken");
require('dotenv').config();
const { Token } = require("./models");


verifyToken = async(req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.send({
            status: "bad request",
            status_code: 400,
            message: "No token provided",
            error: ""
        });

    }
    const isTokenAvailable = await Token.findOne({
        where: { token: token }
    });
    if (!isTokenAvailable) {
        return res.send({
            status: "bad request",
            status_code: 400,
            message: "bad request not token provided",
            error: ""
        });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.send({
                status: "unauthorized",
                status_code: 401,
                message: "unauthorized token provided",
                error: ""
            });
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    isAuth: verifyToken
}