import { Router } from "express";
const router = Router();

const messagesController = require('../controllers/messagesController')

router.get('/get', messagesController.getMessages)

router.post('/save', messagesController.saveMessage)

module.exports = router;