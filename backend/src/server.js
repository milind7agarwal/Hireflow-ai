require("dotenv").config()
const app = require("./index")
const connectToDB = require('./config/database.js')

connectToDB()

app.listen(3000,()=> {
    console.log("server is listening to port 3000")
})