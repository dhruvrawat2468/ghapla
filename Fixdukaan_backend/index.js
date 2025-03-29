
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import Connection from "./db/db.js";
import Route from "./routes/routes.js";
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
Connection();

app.use('/',Route)
app.use(express.urlencoded({extended:false}));

app.listen(port,()=>{
  console.log(`Otp server listening at ${port}`)
})
