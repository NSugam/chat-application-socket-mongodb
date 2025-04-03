require('dotenv').config();
const express = require("express")
const app = express()
import routes from './src/routes';
const cors = require("cors")
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose")
const PORT = process.env.PORT

// Socket Server Imports
const { createServer } = require("http");
import { initializeSocket } from './socket';

//Middleware Imports
const errorMiddleware = require('./src/middlewares/errorMiddleware')
const { checkAuth } = require('./src/middlewares/auth')

//DB Initialization: Mongodb
mongoose.connect(process.env.MONGODB_SERVER || 'mongodb://localhost:27017/chat-application')
  .then(() => {
    console.log("Connected to Mongodb")
  })
  .catch((error: any) => {
    console.error("DB connection error:", error);
  });

//Middlewares
app.use(express.json())
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'https://chat.neupanesugam.com.np'] }));
app.use(cookieParser())
app.use(checkAuth)

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n" + process.env.NODE_ENV, `Server Running OK @ ${PORT}...`);
});
app.get('/', (req: any, res: any) => {
  res.json({Message: "Server running OK @ ", PORT})
});

// Create HTTP Server
const server = createServer(app)

// Initialize Socket
initializeSocket(server)

// all routes from routes/index.ts
app.use('/api', routes);

// global error handler
app.use(errorMiddleware)

export default app;

// iffy