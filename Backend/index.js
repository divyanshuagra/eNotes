const connectToMongo = require('./db')
const express = require('express')
const auth = require('./Routes/auth')
const notes = require('./Routes/notes')
const app = express()
const cors = require('cors')
const port = 5000  //3000 port for react app

connectToMongo()
app.use(cors())
app.use(express.json())   //used for parsing incoming json

app.use('/api/auth', auth)
app.use('/api/notes', notes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

