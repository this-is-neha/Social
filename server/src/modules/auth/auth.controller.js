const express = require('express');
const mailSvc = require('../../modules/services/mail.services');
const bcrypt = require('bcryptjs');
const authSvc = require('./auth.service');
const jwt = require('jsonwebtoken');
const Message= require('./messgae.model')
class AuthController {


    register = async (req, res, next) => {
        try {
            console.log("Incomming request to register user", req.body);
            const file = req.file;
            console.log("Uploaded file:", file);

            const data = authSvc.transformRegisterData(req);
            console.log("Transformed data", data);
            const registeredUser = await authSvc.createUser(data);

            console.log("Uploaded file:", file);

            console.log("Registered user", registeredUser);
            await mailSvc.sendEmail(
                registeredUser.email,
                "Activate your Account!",
                `Dear ${registeredUser.name || "User"},<br/>
                <p>You have registered your account with username <strong>${registeredUser.email}</strong>.</p>
                <p>Please copy and paste the URL in your browser to activate your account:</p>
                <a href="${process.env.FRONTEND_URL}/activate/${registeredUser.activationToken}">
                ${process.env.FRONTEND_URL}/activate/${registeredUser.activationToken}</a><br/>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please don't reply to this email.</em></small></p>`
            );

            res.json({
                result: registeredUser,
                message: "User registered successfully",
                meta: null
            })
        }
        catch (exception) {
            console.error(exception);
            throw exception;

        }
    }


    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            console.log("Incomming request to login user", email);
            const userDetails = await authSvc.findOneUser({ email: email });
            if (!userDetails) {
                throw ({
                    code: 422,
                    message: "User doesn`t exist",
                })
            }

            if (bcrypt.compareSync(password, userDetails.password)) {
                if (userDetails.status != 'active') {
                    throw {
                        code: 400,
                        message: "Your account has not been activated.Please activate or contact administration"
                    }
                }
                const accessToken = jwt.sign({
                    sub: userDetails._id,
                }, process.env.JWT_SECRET)

                const refreshToken = jwt.sign({
                    sub: userDetails._id,
                }, process.env.JWT_SECRET, { expiresIn: '7d' })

                res.json({
                    reult: {
                        detail: userDetails,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    },
                    message: "User logged in successfully",
                    meta: null
                })
                console.log("Logged in")
                console.log("UserId:", userDetails._id)
                console.log("User name:", userDetails.name)
                console.log("User email:", userDetails.email)
                console.log("USer image: ", userDetails.image)

            }
            else {
                throw ({
                    code: 422,
                    message: "Credentials dont match",


                })
            }
        }
        catch (exception) {
            console.error("Error in login", exception)
            throw exception
        }

    }


    activate = async (req, res, next) => {
        try {
            const token = req.params.token
            const associatedUser = await authSvc.findOneUser({ activationToken: token })
            if (!associatedUser) {
                throw {
                    code: 400,
                    message: "Token doesnt exits"
                }
            }
            const updatedResult = await authSvc.updateUser(associatedUser._id, { activationToken: null, status: "active", });


            res.json({
                result: updatedResult,
                messsge: "Your account has beeen activated successfully",
                meta: null
            })
        }
        catch (exception) {
            next(exception)
        }
    }
    getAllUsers = async (req, res, next) => {
        try {
            const userObj = await authSvc.all();
            res.json({
                result: userObj,
                message: "All users",
                meta: null
            })
        }
        catch (exception) {
            console.error("Error in getAllUsers", exception)
            throw exception
        }
    }
    single=async(req,res,next)=>{
    try{
        const userId= req.params.id;
        console.log("UserId is ", userId)
        const userObj = await authSvc.findUserById(userId);
        res.json({
            result: userObj,
            message: "User fetched successfully",
            meta: null
        })
    }
catch(exception){
    console.error("Error in single", exception)}
    }

    followUser = async (req, res, next) => {
        try {
            console.log("Incomming request to follow user", req.params.id);
            console.log("Incomming request from  user", req.params.userId);
           const userObj = await authSvc.follow(req.params.userId, req.params.id);
            console.log("Follwing User is ", userObj)

            res.json({
                result: userObj,
                message: "User followed successfully",
                meta: null
            })
        }
        catch (exception) {
            console.error("Error in followUser", exception)
            throw exception
        }
    }
  
    history= async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json({ result: messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
}


getChatUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    });

    const chatUserSet = new Set();

    messages.forEach((msg) => {
      if (msg.from.toString() !== userId) chatUserSet.add(msg.from.toString());
      if (msg.to.toString() !== userId) chatUserSet.add(msg.to.toString());
    });

    const chatUserIds = Array.from(chatUserSet);
    res.json({ result: chatUserIds });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat users" });
  }
};


    getFollowers = async (req, res, next) => {
        try{
            const userId= req.params.id;
            const followers = await authSvc.getFollowers(userId);
            res.json({
                result: followers,
                message: "Followers fetched successfully",
                meta: null
            })
        }
        catch(exception){
            console.error("Error in getFollowers", exception)
            throw exception
        }   
    }
    getFollowing = async (req, res, next) => {
        try{
            const userId= req.params.id;
            console.log("UserId is ", userId)
            const following = await authSvc.getFollowing(userId);
            res.json({
                result: following,
                message: "Following fetched successfully",
                meta: null
            })
        }
        catch(exception){
            console.error("Error in getFollowing", exception)
            throw exception
        }
    }
    getLoggedIn = async (req, res, next) => {

        try {
            const authHeader = req.headers.authorization;
            console.log("Auth header is ", authHeader)
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Authorization header missing or invalid" });
            }

            const token = authHeader.split(' ')[1];
            console.log("token is ", token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await authSvc.findOneUser({ _id: decoded.sub });
            console.log("User is ", user)
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const response = {
                _id: user._id,
                name: user.name,
                email: user.email,
                status: user.status,
                image: user.image,
            };
            console.log("resposne is ", response)
            res.json({
                result: response,
                message: "Your Profile",
                meta: null,
            });
        }
        catch (exception) {
            console.error("Error in getLoggedIn:", exception);
            next(exception);
        }
    };

    update = async (req, res, next) => {
        try {
            const newData = {
                ...req.body,
            };


            if (req.file) {
                newData.image = req.file.filename;
            }
            console.log("new data", newData)
            const id = req.params.id.trim();
            const userObj = await authSvc.updateUser(id, newData)

            res.json({
                result: userObj,
                message: "User Updated Successfully",
                meta: null

            })
        }
        catch (exception) {
            throw exception
        }
    }

}

const authController = new AuthController();
module.exports = authController;