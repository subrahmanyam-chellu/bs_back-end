const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Post = require('../models/posts');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Log = require('../models/logs');

dotenv.config();

exports.createUser = async (body) => {
    try {
        const bcryptedPassword = await bcrypt.hash(body.password, Number(process.env.SALTS));
        const newUser = new User({
            profileUrl: body.profileUrl,
            name: body.name,
            email: body.email,
            phoneNumber: body.phoneNumber,
            password: bcryptedPassword,
            role: body.role,
            penName: body.penName
        });
        const result = await newUser.save();
        const userResponse = result.toObject();
        delete userResponse.password;
        return userResponse;
    }
    catch (err) {

        if (err.code === 11000) {
            const error = new Error("Duplicate field value");
            error.statusCode = 409;
            throw error;
        }

        const error = new Error("User creation failed");
        error.statusCode = 500;
        throw error;
    }
};
//delete operation
exports.deleteUser = async (id) => {
    try {
        const result = await User.deleteOne({ _id: id });

        return {
            message: "Successfully deleted",
            deleteCount: result.deletedCount
        };

    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 500;
        throw error;
    }
};
//getuser operation
exports.getUser = async (id) => {
    try {
        const user = await User.findById(id);

        if (!user) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 500;
        throw error;
    }
};
//update user operation
exports.updateUser = async (userData) => {
    try {
        const updatedUser = await User.findOneAndReplace(
            { _id: userData._id },
            userData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        return userResponse;

    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//update password operation
exports.updatePassword = async (userData) => {
    try {
        const password = await bcrypt.hash(userData.password, Number(process.env.SALTS));
        const updatedUser = await User.findOneAndUpdate(
            { _id: userData._id },
            { $set: { password: password } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        return userResponse;

    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//update profile operation
exports.updateProfile = async (userData) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userData._id },
            { $set: { profileUrl: userData.profileUrl } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        return userResponse;

    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//post creation operation
exports.createPost = async (postData) => {
    try {
        const post = new Post({
            title: postData.title,
            image: postData.image,
            content: postData.content,
            penName: postData.penName,
            authorId: postData.authorId,
            status: 'draft'
        })
        const posts = await post.save();
        return (posts);
    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//posts search operation
exports.searchPosts = async (text) => {
    try {
        const posts = await Post.find({ title: { $regex: text, $options: "i" } }).sort({ createdAt: 1 });
        if (!posts) {
            const error = new Error("sorry no posts are there for this search");
            error.statusCode = 404;
            throw error;
        }
        return posts;

    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
// post delete operation
exports.deletePost = async (id) => {
  try {
    const result = await Post.deleteOne({ _id: id });

    return {
      message: result.deletedCount > 0 
        ? "Successfully deleted" 
        : "No post found with given ID",
      deleteCount: result.deletedCount
    };
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 500;
    throw error;
  }
};
//update post operation
exports.updatePost = async (postData) => {
    try {
        const updatedPost = await Post.findOneAndReplace(
            { _id: postData._id },
            postData,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            const error = new Error("post does not exist");
            error.statusCode = 404;
            throw error;
        }

        const postResponse = updatedPost.toObject();
        return postResponse;

    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//getting all posts operations
exports.getAllPosts = async (conditions) => {
    try {
        const pCount = await Post.countDocuments();
        const pageNo = parseInt(conditions.query.pageNo) || 1;
        const pageSize = parseInt(conditions.query.pageSize) || 20;
        const sortOrder = conditions.query.sortOrder === "desc" ? -1 : 1;

        const skip = ((pageNo - 1) * pageSize);

        const posts = await Post.find().skip(skip).limit(pageSize).sort({ sortOrder });
        if (posts.length === 0) {
            const error = new Error("no posts are there");
            error.statusCode = 400;
            throw error;
        }
        return {
            totalPosts: pCount,
            posts: posts
        }
    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//verifying user to get login
exports.authLogin = async (userData) => {
    try {
        const user = await User.findOne({ email: userData.email });

        if (!user) {
            const error = new Error("user does not exists");
            error.statusCode = 404;
            throw error;
        }
        else {
            const matched = await bcrypt.compare(userData.password, user.password);
            if (matched) {
                const payload = { userId: user._id, userRole: user.role };
                const jwtKey = process.env.JWT_SECRET_KEY;
                const options = { expiresIn: "7d" };
                const token = jwt.sign(payload, jwtKey, options);

                const userResponse = user.toObject();
                delete userResponse.password;
                return {token:token, user:userResponse};
            } else {
                const error = new Error("user credentials are invalid.");
                error.statusCode = 401;
                throw error;
            }
        }

    } catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//logging actions
exports.logData = async(action, by)=>{
    try{
        const log = new Log({action: action, by: by});
        const result = await log.save();
        return result;
    }catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//getting own posts operation
exports.getMyPosts = async(authorId)=>{
    try{
        const allPosts = await Post.find({authorId:authorId});
        if(allPosts.length>0){
            return allPosts;
        }else{
            return null;
        }

    }catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
}
//publishing draft operation
exports.doPost = async (postId)=>{
    try{
        const result = await Post.updateOne({_id: postId}, {$set:{status:"posted"}}, {runValidators:true});
        if(result.acknowledged==true && (result.matchedCount===1 && result.modifiedCount===1))
            return {value:1};
        else if(result.acknowledged==true && (result.matchedCount===1 && result.modifiedCount===0))
            return {value:2};
        else if(result.acknowledged==true && (result.matchedCount===0 && result.modifiedCount===0))
            return {value:3};
        else
            return {value:4};
    }catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//publishing all drafts operation
exports.doPostAll = async ()=>{
    try{
        const result = await Post.updateMany({status: "draft"}, {$set:{status:"posted"}}, {runValidators:true});
        if(result.acknowledged==true && (result.matchedCount>=1 && result.modifiedCount>=1))
            return result;
        else
            return null;
    }catch (err) {
        if (err.name === 'CastError') {
            const error = new Error("Invalid ID format");
            error.statusCode = 400;
            throw error;
        } else if (err.name === 'ValidationError') {
            const error = new Error("Validation failed: " + err.message);
            error.statusCode = 400;
            throw error;
        } else {
            const error = new Error(err.message);
            error.statusCode = 500;
            throw error;
        }
    }
};
//deleting all users operation(admin)
exports.deleteAllUsers = async()=>{
    try{
        const result = await User.deleteMany({});
        if(result.deletedCount>0)
            return result;
        else
            return null;
    }catch(err){
        const error = new Error(err.message||"database error");
        error.status = err.statusCode||500;
    }
};
//deleting user all posts(admin)
exports.deleteAllPosts = async(authorId)=>{
    try{
        const result = await Post.deleteMany({authorId:authorId});
        if(result.deletedCount>0)
            return result;
        else
            return null;
    }catch(err){
        const error = new Error(err.message||"database error");
        error.status = err.statusCode||500;
    }
};