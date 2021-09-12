const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../Middlewares/fetchUser')
const JWT_SECRET = 'DIVYANSHU'


//Route 1: creating user POST api, login not required

router.post('/createuser', [
     body('email').isEmail(),
     body('password').isLength({ min: 6 }),
     body('name').isLength({ min: 4 })
], async(req, res) => {
    //if there are any validation errors, return errors
     const errors = validationResult(req);   
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //else check if the user(email) already exists or not, if not then create one
    try {
         let user = await User.findOne({email: req.body.email})

    if(user) return res.status(400).json({error: "user already exists"})

    //generating salt using bcrypt to generate a secured password
    const salt  = await bcrypt.genSalt(12)
    const securedPass = await bcrypt.hash(req.body.password, salt)

    //create new user
    user = await User.create({
      name: req.body.name,
      password: securedPass,
      email: req.body.email
    })
    
    //id is used as data for assigning token
    const data = {
        user : {
             id: user.id
        }
        
    }

    //creating token
    const authToken = jwt.sign(data, JWT_SECRET)
    
    res.json({authToken})

    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occurred")
    }
   
})

//Route 2: login api 
router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], async (req,res) =>{

 const errors = validationResult(req);   
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const {email,password} = req.body
  try {
      //checking if user with the email exists 
      let user = await User.findOne({email})
      if(!user) return res.status(400).json({error: "invalid credentials"})
      
      //checking password
      const comparePass = await bcrypt.compare(password,user.password) //return true/false
      console.log(comparePass)
      if(!comparePass) return res.status(400).json({error: "invalid credentials"})
      
      const data = {
        user : {
             id: user.id
        }
        
    }

    //creating token
    const authToken = jwt.sign(data, JWT_SECRET)
    
    res.json({authToken})

    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occurred")
    }
})

//Route 3: get logged in user details, POST api, Login required

router.post('/getuser', fetchUser, async (req,res)=>{

  try {
    const userId = req.user.id
    const user  =  await User.findById(userId)
    res.send(user)
} catch (error) {
        console.log(error.message)
        res.status(500).send("some error occurred")
    }
})

module.exports = router