const express = require("express");
const { response } = require("../app");
const User = require("../models/user");
const Router = express.Router;
const router = new Router;
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/',ensureLoggedIn, async (request, response, next)=> {
    try{
        const users = await User.all()
        return response.json({users})
    }
    catch(err){
        next()
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username',ensureCorrectUser, async (request, response, next)=> {
    try{
        const user = await User.get(request.params.username)
        return response.json({user})
    }
    catch(err){
        next()
    }
})




/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to',ensureLoggedIn, async (request, response, next)=> {
    try{
        const messages_to = await User.messagesTo(request.params.username)
        return response.json({messages_to})
    }
    catch(err){
        next()
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from',ensureLoggedIn, async (request, response, next)=> {
    try{
        const messages_from = await User.messages_from(request.params.username)
        return response.json({messages_from})
    }
    catch(err){
        next()
    }
})

module.exports = router;
