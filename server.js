const express = require("express");
const MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const Router = express.Router();
const PORT = process.env.PORT || "3000";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

MongoClient.connect(process.env.MONGODB_STRING, { useUnifiedTopology: true })
	.then((client) => {
		const db = client.db("to_do_app");
		const usersCollection = db.collection("users");
		const tasksCollection = db.collection("tasks");
		// varify token
		async function tokenVerify(req, res, next) {
			let token = req.header("authorization");
			try {
				jwt.verify(token.split(" ")[1], "secret");
			} catch (err) {
				return res.status(422).send("invalid token");
			}
			next();
		}
		// create user
		Router.post("/register", async (req, res) => {
			let { email, password } = req.body;
			const registerUser = await usersCollection.insertOne({
				email: email,
				password: password,
			});
			return res.status(202).json({
				user: {
					_id: registerUser.insertedId,
					email: email,
				},
			});
		});
		// list task
		Router.get("/users-list", tokenVerify, async (req, res) => {
			const usersList = await usersCollection.find().toArray();
			return res.status(200).json({
				users: usersList,
			});
		});
		// create task
		Router.post("/create-task", async (req, res) => {
			let { name } = req.body;
			const registerTask = await tasksCollection.insertOne({
				name: name,
			});
			return res.status(202).json({
				task: {
					_id: registerTask.insertedId,
					name: name,
				},
			});
		});
		// list task
		Router.get("/tasks-list", tokenVerify, async (req, res) => {
			const taskList = await tasksCollection.find().toArray();
			return res.status(200).json({
				tasks: taskList,
			});
		});
		// login user
		Router.post("/login", (req, res) => {
			let { email, password } = req.body;
			let token = jwt.sign(
				{
					data: email,
				},
				"secret",
				{ expiresIn: "1h" }
			);
			return res.status(200).json({
				token: token,
			});
		});
		// db connected
		console.log("Connected to Database");
	})
	.catch((error) => console.error(error));

app.use(Router);

app.listen(PORT, () => {
	console.log(`Server is listening ${PORT}`);
});
