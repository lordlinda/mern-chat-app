const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

const { auth } = require("../middleware/auth");

//=================================
//             Chat
//=================================

router.get("/getChats", async (req, res) => {
  try {
    const chats = await Chat.find().populate("sender");
    res.status(200).send(chats);
  } catch (err) {
    return res.json({ sucess: false });
  }
});

module.exports = router;
