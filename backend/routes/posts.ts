import express from 'express';
const isAuth = require('../middleware/is-auth');

const PostController = require('../controllers/posts');

const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', isAuth, extractFile, PostController.createPost);

router.put('/:id', isAuth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.delete('/:id', isAuth, PostController.deletePost);

module.exports = router;
