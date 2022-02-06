const express = require("express");
const { MongoClient } = require("mongodb");
require('dotenv').config();
var bodyParser = require('body-parser')

const app = express();
const Router = express.Router()
const PORT = process.env.PORT || "3000";

// console.log("process",process.env)




async function main(){
   /**
    * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
    * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
    */
    const client = new MongoClient(process.env.MONGODB_STRING);
    
    const db = client.db("test");
    const collection = db.collection("users")

   try {
       // Connect to the MongoDB cluster
       await client.connect();

       // Make the appropriate DB calls
      //  await  listDatabases(client);

   } catch (e) {
       console.error(e);
   } finally {
       await client.close();
   }
}

main().catch(console.error);



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(Router)

Router.post("/register",async (req,res)=>{
   const registerUser = await collection.insertOne({
      "title" : req.body.title
   })
   console.log(registerUser);
   // const insertData = db.find();
   return res.send('Hello World!')
});

app.use("/kwanso",Router)

app.listen(PORT, () => {
	console.log(`Server is listening ${PORT}`);
});
