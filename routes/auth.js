const express = require("express");
const jwt = require('jsonwebtoken');
const { response } = require("../app");
const router = new express.Router;

const User = require('../models/user')
const { SECRET_KEY } = require('../config')
const ExpressError = require("../expressError")

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (request, response, next)=> {
    try{
        const {username,password} = request.body;
        let user = User.authenticate(username, password);

        if(user){
            if( await bcrypt.compare(password, user.password) === true){
                let token = jwt.sign({ username }, SECRET_KEY)
                return response.json({token})
            }
        }else{
            throw new ExpressError('Invalid Username/Password', 400)
        }
    }
    catch(err){
        next()
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (request, response, next) => {
    try{
        const {username} = User.register(request.body);
        let token = jwt.sign({username}, SECRET_KEY)
        User.updateLoginTimestamp(username);
        return response.json({token})
    }
    catch(err){
        next()
    }
})

module.exports = router;
