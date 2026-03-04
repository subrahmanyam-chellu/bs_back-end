const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authToken = require('../middlewares/authToken');
const { verify } = require('jsonwebtoken');
const authRole = require('../middlewares/authRole');

router.get('/', userController.greet);
router.post('/sign-up', userController.createUser);
router.post('/login', userController.login);
router.delete('/delete/:userId', authToken, userController.deleteUser);
router.get('/getuser/:userId', authToken, userController.getUser);
router.patch('/updateuser/:userId', authToken, userController.updateUser);
router.patch('/updatepassword/:userId', authToken, userController.updatePassword);
router.patch('/updateprofile/:userId', authToken, userController.updateProfile);
router.post('/createpost/', authToken, userController.createPost);
router.get('/searchposts/:text', authToken, userController.searchPosts);
router.delete('/deletepost/:postId', authToken, userController.deletePost);
router.patch('/updatepost/:postId', authToken, userController.updatePost);
router.get('/getallposts', authToken, userController.getAllPosts);
router.get('/publish/:postId', authToken, userController.doPost);
router.get('/publishall', authToken, userController.doPostAll);
router.get('/myposts/:userId', authToken, userController.getMyPosts);
router.delete('/deleteallusers', authToken, userController.deleteAllUsers);
router.delete('/deleteallposts/:userId', authToken, userController.deleteAllPosts);

module.exports = router;