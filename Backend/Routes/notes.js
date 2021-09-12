const express = require('express')
const router = express.Router()
const fetchUser = require('../Middlewares/fetchUser')
const Notes = require('../Models/Notes')
const { body, validationResult } = require('express-validator')


//Route 1: Get all notes, GET api, Login required
router.get('/fetchallnotes', fetchUser, async (req,res)=>{
    const notes = await Notes.find({user: req.user.id})
    res.json(notes)
})

//Route 2: add notes, POST api ,Login required
router.post('/addnotes', fetchUser, [
     body('title').isLength({ min: 6 }),
     body('description').isLength({ min: 10 })
], async (req,res)=>{
      
      const {title,description,tag} = req.body
     //if there are any validation errors, return errors
     const errors = validationResult(req);   
     if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        //create new note
         const notes = await Notes.create({
         title,
         description,
         tag,
         user: req.user.id
    })

        res.json(notes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occurred")
    }


})

//Route 3: update notes, PUT api ,Login required
router.put('/updatenote/:id', fetchUser, [
     body('title').isLength({ min: 6 }),
     body('description').isLength({ min: 10 })
], async (req,res)=>{
      
      const {title,description,tag} = req.body
     //if there are any validation errors, return errors
     const errors = validationResult(req);   
     if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Find the note that is to be updated, by note id(mentioned in url)
        const noteId = req.params.id
        let note = await Notes.findById(noteId)
        
        //id of the logged in user
        const userId = req.user.id

        //if note does not exists
        if(!note) return res.status(404).send("note not found")

        //verify that the note belongs to the logged in user
        if(note.user.toString() != userId) return res.status(401).send("unauthorised")
        
        //update the fields which are available in req object
        if(title) note.title = title
        if(description) note.description = description
        if(tag) note.tag = tag
        
        //save the updated note
        note.save()

        res.json(note)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occurred")
    }


})

module.exports = router