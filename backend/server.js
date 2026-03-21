require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database.js")

connectToDB()

app.listen(3000,()=> {
    console.log("server is listening to port 3000")
})