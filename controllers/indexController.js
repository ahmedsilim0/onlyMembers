const User = require('../models/user');
const Message = require('../models/message');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');



exports.index_get = function (req, res, next) {
  Message
    .find()
    .populate('user')
    .exec((err, list_messages) => {
      if (err) return next(err);
      // Sort the messages by newest
      list_messages.sort((a,b) => {
        if (a.timestamp > b.timestamp) {
          return -1
        } else {
          return 1;
        }
      })

      res.render('index', { messages: list_messages });
    })
}


exports.user_create_get = function(req, res, next) {
  res.render('signup-form');
}

exports.user_create_post = [
  body('name', 'Name must not be empty.').trim().isLength({ min: 1}).escape(),
  body('username', 'Username must be at least 4 characters.').isLength({ min: 4 }).escape(),
  body('password', 'Password must be at least 6 characters.').isLength({ min: 6 }).escape(),
  function(req, res, next) {
    const errors = validationResult(req);
    if (req.body.confirmPassword !== req.body.password) {
      res.render('signup-form', { errors: 
        [ {msg: "Passwords do not match!"} ] 
      });
    }
    else if (!errors.isEmpty()) {
      res.render('signup-form', { errors: errors.array() });
    } else {
      // Else if the form is valid, save the new user
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          name: req.body.name,
          username: req.body.username,
          password: hashedPassword,
          membership: 'guest',
        });
        user.save((err) => {
          if (err) return next(err);
          
          res.redirect("/login");
        })
      });
    }

  }]

exports.user_logout_get = function(req, res, next) {
  req.logout();
  res.redirect("/");
}

exports.message_create_post = async function(req, res, next) {
  const userId = res.locals.currentUser["_id"];

  if (req.body.title === "" || req.body.text === "") {
    res.redirect('/');
  } else {
    const message = new Message(
      {
        title: req.body.title,
        text: req.body.text,
        timestamp: new Date().getTime(),
        user: userId,
      }
    )
  
    const msgId = message["_id"];
  
    await User.findOneAndUpdate(
      {"_id" : userId }, 
      { "$push": { "messages" : msgId } }
    )
  
    await message.save((err) => {
      if (err) return next(err);
      res.redirect('/');
    })
  }

}

exports.user_login_get = function(req, res, next) {
  res.render('login-form');
}

exports.join_get = function(req, res, next) {
  res.render('join-form');
}

exports.join_post = async function(req, res, next) {
  if (res.locals.currentUser.membership === req.body.membership) {
    res.render('join-form', { error: `You are already a ${req.body.membership}`})
  } else {

    if (req.body.membership === "admin") {
      if (req.body.password !== "adminpassword") {
        res.render('join-form', { error: `Error, wrong admin password`})
      } else {
        await User.findOneAndUpdate(
          {"_id" : res.locals.currentUser["_id"] }, 
          { "membership" : req.body.membership },
        )
        res.redirect('/');
      }
    } else {
      await User.findOneAndUpdate(
        {"_id" : res.locals.currentUser["_id"] }, 
        { "membership" : req.body.membership },
      )
      res.redirect('/');
    }
  }
}

exports.user_list_get = function(req, res, next) {
  User
    .find()
    .exec((err, list_users) => {
      if (err) return next(err);

      const admins = list_users.filter(user => user.membership === "admin")
      const members = list_users.filter(user => user.membership === "member")
      const guests = list_users.filter(user => user.membership === "guest")

      res.render('list-users', { admins: admins, members: members, guests: guests });
  })
}

exports.message_remove_post = function(req, res, next) {
  Message.findByIdAndRemove(req.body.messageid, (err) => {
    if (err) return next(err);

    res.redirect('/');
  })
}