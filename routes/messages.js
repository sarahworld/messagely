const express = require("express");
const Router = express.Router;
const router = new Router;
const jwt = require('jsonwebtoken');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const { request, response } = require("../app");
const Message = require('../models/message')
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureCorrectUser, async(request, response, next)=>{
    let message = await Message.get(request.params.id)
    return response.json({message})
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async(request, response, next)=>{
    let { from_username, to_username, body} = request.body
    let new_message = await Message.create(from_username, to_username, body)
    return response.json({new_message})
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureLoggedIn, async(request, response, next)=>{
    
    let read_message = await Message.markRead(request.params.id);
    return response.json({read_message})
})

module.exports = router;
