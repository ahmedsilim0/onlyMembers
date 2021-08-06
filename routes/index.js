const express = require('express');
const router = express.Router();
const index_controller = require('../controllers/indexController');
const auth = require('../auth');

/* GET home page. */
router.get('/', index_controller.index_get);

// List all users and their status
router.get('/users', index_controller.user_list_get);

// User Auth request handlers
router.get('/signup', index_controller.user_create_get);
router.post('/signup', index_controller.user_create_post);
router.get('/logout', index_controller.user_logout_get);
router.get('/login', index_controller.user_login_get);
router.post('/login', auth.user_login_post);

// Message request handlers
router.post('/message', index_controller.message_create_post);
router.post('/message/delete', index_controller.message_remove_post);

// Join the club
router.get('/join', index_controller.join_get);
router.post('/join', index_controller.join_post);


module.exports = router;