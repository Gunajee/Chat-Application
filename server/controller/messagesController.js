const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: message, // Directly pass the message string
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added Successfully." });
    return res.json({ msg: "Failed to add message to the database" });
  } catch (exception) {
    next(exception);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: { $all: [from, to] }, // Find messages where both users are present
      })
      .sort({ updatedAt: 1 }); // Sort by the message creation or update time

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message, // The actual message content
      };
    });

    res.json(projectedMessages);
  } catch (exception) {
    next(exception);
  }
};
