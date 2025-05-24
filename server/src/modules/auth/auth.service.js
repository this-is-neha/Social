const { generateRandomString } = require('../utilities/helpers');
const bcrypt = require('bcrypt');
const UserModel = require('./auth.model');

class AuthService {
    transformRegisterData = (req) => {

        try {
            console.log("req.body", req.body)
            const payload = req.body;
            const file = req.file
            payload.password = bcrypt.hashSync(payload.password, 10);
            payload.status = "inactive";
            payload.activationToken = generateRandomString(32);

            return ({
                name: payload.name,
                image: file?.filename,
                email: payload.email,
                password: payload.password,
                activationToken: payload.activationToken,
                status: payload.status
            })
        }
        catch (exception) {
            console.error("Error in transformRegisterData", exception)
            throw exception
        }

    }

    createUser = async (data) => {
        try {
            const user = new UserModel(data);
            return await user.save()
        }
        catch (exception) {
            console.error("Error in createUser", exception)
            throw exception
        }
    }

    findOneUser = async (filter) => {
        try {
            const userObj = await UserModel.findOne(filter)
            return userObj
        }
        catch (exception) {
            console.error("Error in findOneUser", exception)
            throw exception
        }
    }

    findUserById = async (id) => {
        try {
            console.log("id", id)
            const userObj = await UserModel.findById(id);

            return userObj
        }
        catch (exception) {
            console.error("Error in findUserById", exception)
            throw exception
        }
    }

    findOneUserById = async (filter) => {
        try {
            console.log("Finding user with filter", filter)
            if (!filter._id || !filter.resetToken) {
                throw new Error("Invalid filter, missing required fields");
            }
            const userObj = await UserModel.findOne({ id: filter._id })
            console.log("User is ", userObj)
            if (!userObj) {
                console.error("User not found with filter:", filter);
                throw new Error("User not found");
            }

            console.log("User found:", userObj);
            return userObj;
        }

        catch (exception) {
            console.error("Error in findObeUserById", exception)
            throw exception
        }

    }
    deleteUser = async (id) => {
        console.log("Id of User is", id)
        try {
            const userObj = await UserModel.findByIdAndDelete(id);
            console.log("User deleted successfully", userObj)
            return userObj
        }
        catch (exception) {
            console.error("Error in deleteUser", exception)
            throw exception
        }
    }

    updateUser = async (id, data) => {
        console.log("Id of User is", id)
        try {
            const userObj = await UserModel.findByIdAndUpdate(id, data, { new: true });
            console.log("User updated successfully", userObj)
            return userObj
        }
        catch (exception) {
            console.error("Error in updateUser", exception)
            throw exception

        }

    }

    all = async () => {
        try {
            const userObj = await UserModel.find();
            return userObj
        }
        catch (exception) {
            console.error("Error in all", exception)
            throw exception
        }
    }



    follow = async (followerId, targetUserId) => {
        try {
            const user = await UserModel.findById(followerId);

            if (!user) throw new Error("Follower user not found");
            if (!targetUserId) throw new Error("Target user ID is missing");

            const index = user.follow.indexOf(targetUserId);
            if (index === -1) {
                user.follow.push(targetUserId);
            } else {
                user.follow.splice(index, 1);
            }

            await user.save();
            return user;
        } catch (exception) {
            console.error("Error in follow", exception);
            throw exception;
        }
    };

getFollowing = async (userId) => {
        try {
            const users = await UserModel.findById(userId).populate('follow', 'name email image');
            if (!users) {
                throw new Error('User not found');
            }
            return users.follow;
        } catch (exception) {
            console.error('Error in getFollowing', exception);
            throw exception;
        }
    };

    getFollowers = async (userId) => {
        try {
            const followers = await UserModel.find({ follow: userId });
            return followers;
        } catch (exception) {
            console.error("Error in getFollowers", exception);
            throw exception;
        }
    };

    verifyToken = async (token) => {
        try {
            const userObj = await jwt.verify(token, process.env.JWT_SECRET_KEY)
            return userObj
        }
        catch (exception) {
            console.error("Error in verifyToken", exception)
            throw exception
        }
    }

    resetPassword = async (password, token) => {
        try {
            const decoded = this.verifyToken(token);
            const userObj = await this.findOneUser({ id: decoded.sub, resetToken: token });
            if (!userObj) {
                throw new Error("Invalid token")
            }
            else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                userObj.password = hashedPassword;
                userObj.resetToken = null;
                await user.save();
                return { message: "Password reset successfully" };
            }
        }
        catch (exception) {
            console.error("Error in resetPassword", exception)
            throw exception
        }
    }
}
const authSvc = new AuthService()
module.exports = authSvc;