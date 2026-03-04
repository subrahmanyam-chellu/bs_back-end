const userService = require('../services/userServices');

exports.greet = (req, res) => {
    res.status(200).json('welcome to blog spot');
};
//for user account creation
exports.createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(201).json({ message: 'user created successfully', data: result });
    }
    catch (err) {
        if (err.statusCode == 409) {
            res.status(409).json({ message: 'email or number or pen name already exists' });
        }
        else {
            res.status(500).json({ message: 'internal server error' });
        }

    }

};
// for user account deletion by user(his/her)
exports.deleteUser = async (req, res) => {
    try {
        const selfRoles = ['author', 'user'];
        const adminRoles = ['admin', 'editor'];
        console.log(req.user.userRole);
        if ((selfRoles.includes(req.user.userRole) && req.user.userId === req.params.userId) || (adminRoles.includes(req.user.userRole))) {
            const deleteResult = await userService.deleteUser(req.params.userId);
            const logResult = await userService.logData("user deletion", req.user.userId);

            return res.status(200).json({ deleteResult: deleteResult, logResult: logResult });
        }
        else {
            return res.status(403).json({ message: "you don not have the rights to do this." });
        }
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
};
//getUser to get user details (his/her)
exports.getUser = async (req, res) => {
    try {
        const role = req.user.userRole;
        if (((role === 'user' || role === 'author') && (req.user.userId === req.params.userId)) || (role === 'admin' || role === 'editor')) {
            const result = await userService.getUser(req.params.userId);
            res.status(200).json({ message: 'user successfully fetched', user: result });
        }
        else {
            res.status(403).json({ message: 'you don not have the rights to do this.' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//total modification-- update
exports.updateUser = async (req, res) => {
    try {
        const role = req.user.userRole;
        if (((role === 'user' || role === 'author') && (req.user.userId === req.params.userId)) || (role === 'admin' || role === 'editor')) {

            const result = await userService.updateUser(req.body);
            res.status(200).json({ message: 'successfully updated', user: result });
        } else {
            res.status(403).json({ message: 'you don not have the rights to do this.' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
}
//password update operation
exports.updatePassword = async (req, res) => {
    try {
        const role = req.user.userRole;
        console.log(role + " " + req.params.userId);
        if (((role === 'user' || role === 'author') && (req.user.userId === req.params.userId)) || (role === 'admin' || role === 'editor')) {
            const result = await userService.updatePassword(req.body.user);
            res.status(200).json({ message: 'successfully updated', user: result });
        } else {
            res.status(403).json({ message: 'you don not have the rights to do this.' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//password update operation
exports.updateProfile = async (req, res) => {
    try {
        const role = req.user.userRole;
        console.log(role + " " + req.params.userId + " " + req.user.userId);
        if (((role === 'user' || role === 'author') && (req.user.userId === req.params.id)) || (role === 'admin' || role === 'editor')) {
            const result = await userService.updateProfile(req.body);
            res.status(200).json({ message: 'successfully updated', user: result });
        } else {
            res.status(403).json({ message: 'you don not have the rights to do this.' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//post creation operation
exports.createPost = async (req, res) => {
    try {
        const roles = ['admin', 'editor', 'author'];
        if (roles.includes(req.user.userRole)) {
            const post = await userService.createPost(req.body);
            res.status(200).json({ message: 'post created successfully', post: post });
        } else {
            res.status(403).json({ message: 'you don not have the rights to do this.' });
        }

    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//search for posts
exports.searchPosts = async (req, res) => {
    try {
        const posts = await userService.searchPosts(req.params.text);
        if (posts.length < 1) {
            return res.status(404).json({ message: 'Sorry, no related posts are there.' });
        }
        res.status(200).json({ message: 'related posts fetched successfully', posts: posts });

    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
}
//post delete operation
exports.deletePost = async (req, res) => {
    try {
        const allPosts = await userService.getMyPosts(req.user.userId);
        if ((req.user.userRole === 'admin' || req.user.userRole === 'editor') || (req.user.userRole === 'author' && (allPosts && allPosts.some(post => post._id === req.params.postId)))) {
            const deleteResult = await userService.deletePost(req.params.postId);
            if (deleteResult.deleteCount === 0) {
                return res.status(404).json({ message: 'Post to be deleted is not exists.' })
            }
            const logResult = await userService.logData("Post deletion", req.user.userId);
            return res.status(200).json({ deleteResult: deleteResult, logResult: logResult });
        } else {
            return res.status(403).json({ message: 'you do not have the rights to do this.' });
        }
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
};
// post updation
exports.updatePost = async (req, res) => {
    try {
        const allPosts = await userService.getMyPosts(req.user.userId);
        if ((req.user.userRole === 'admin' || req.user.userRole === 'editor') || (req.user.userRole === 'author' && (allPosts && allPosts.some(post => post._id === req.params.postId)))) {
            const result = await userService.updatePost(req.body.post);
            res.status(200).json({ message: 'successfully updated', post: result });
        } else {
            return res.status(403).json({ message: 'you don not have the rights to do this.' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//getting all posts for user
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await userService.getAllPosts(req);
        res.status(200).json({ message: 'posts successfully fetched', totalPosts: posts.totalPosts, posts: posts.posts });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
}
// 
exports.login = async (req, res) => {
    try {
        const user = await userService.authLogin(req.body);
        res.status(200).json({
            message: 'successfully logged in',
            token: user
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//posting the drafted post with id
exports.doPost = async (req, res) => {
    try {
        if (req.user.userRole === 'admin' || req.user.userRole === 'editor') {
            const result = await userService.doPost(req.params.postId);
            if (result.value === 1) {
                return res.status(200).json({ message: 'published successfully.' });
            } else if (result.value === 2) {
                return res.status(400).json({ message: 'please try again' });
            } else if (result.value === 3) {
                return res.status(404).json({ message: 'post does not exists.' });
            } else {
                return res.status(500).json({ message: 'please try again' });
            }
        }
        else {
            return res.status(403).json({ message: 'you does not have the right to do this' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//posting the all drafted posts
exports.doPostAll = async (req, res) => {
    try {
        if (req.user.userRole === 'admin' || req.user.userRole === 'editor') {
            const result = await userService.doPostAll();
            if (!result) {
                return res.status(404).json({ message: 'drafts are not exists' });
            }
            else {
                return res.status(200).json({ message: 'All are published successfully.', modifiedCount: result.modifiedCount });
            }
        }
        else {
            return res.status(403).json({ message: 'you does not have the right to do this' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//getting own posts
exports.getMyPosts = async (req, res) => {
    try {
        const result = await userService.getMyPosts(req.user.userId);
        if (!result) {
            return res.status(404).json({ message: 'you does not have any posts yet.' });
        }
        return res.status(200).json({ message: 'successfully fetched your posts' });
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//deleting all users (admin)
exports.deleteAllUsers = async (req, res) => {
    try {
        if (req.user.userRole === 'admin') {
            const result = await userService.deleteAllUsers();
            if (!result) {
                return res.status(404).json({ message: 'users does not exists.' });
            }
            return res.status(200).json({ message: 'users deleted successfully.', result: result.deletedCount })

        } else {
            return res.status(403).json({ message: 'you does not have the rights to do this' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
//deleting all users (admin)
exports.deleteAllPosts = async (req, res) => {
    try {
        if (req.user.userRole === 'admin') {
            const result = await userService.deleteAllPosts(req.params.userId);
            if (!result) {
                return res.status(404).json({ message: 'users does not exists.' });
            }
            return res.status(200).json({ message: 'users deleted successfully.', result: result.deletedCount });
        } else {
            return res.status(403).json({ message: 'you does not have the rights to do this' });
        }
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });

    }
};
