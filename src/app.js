const express = require("express");
const HttpStatusCode = require("./utils/httpStatusCode");
const {getAllTasks, getTaskDetails, createTask, patchTask, deleteTask, putTask} = require("./controllers/taskController");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/globalErrorHandler");
const morgan = require('morgan')


dotenv.config({
    path:'./.env'
});

// express app
const app = express();

app.use(express.json());

app.use(morgan('dev'));

//express env
console.log(app.get('env'));

//node env
console.log(process.env);


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to Naseem's API!");
});


app.get("/api/v1/tasks", getAllTasks);

app.get("/api/v1/tasks/:id/:dest?/:place?", getTaskDetails);

app.post("/api/v1/tasks", createTask);

app.patch("/api/v1/tasks/:id", patchTask);

app.delete("/api/v1/tasks/:id", deleteTask);

app.all('*', (req, res, next) => {  
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, HttpStatusCode.NOT_FOUND));
});


app.use(globalErrorHandler);

//connect to mongo GB
const DB = process.env.MONGO_DB_CONNECTION.replace('<PASSWORD>', process.env.MONGO_DB_PASSWORD);

mongoose.connect(DB)
.then(() => console.log("DB connection successful!"))
.catch((err) => console.log(err));

app.listen(3000, () => {
    console.log("Server started on port 3000");
});