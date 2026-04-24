const mongoose = require('mongoose');
const Notice = require('../../models/notice.model');

const SendNotice = async (req, res) => {
  try {
    const receiver_role = req.body.receiver_role || "student";

    const sender_role = req.body.sender_role;
    const title = req.body.title;
    const message = req.body.message;
    const senderId = req.body.sender || req?.user?._id;

    if (!sender_role || !message || !senderId) {
      return res.status(400).json({ msg: "Required fields are missing!" });
    }

    const sender = new mongoose.Types.ObjectId(senderId);
    const attachment = req.file
      ? {
        filename: req.file.filename,
        filepath: `/noticeAttachments/${req.file.filename}`,
        contentType: req.file.mimetype,
      }
      : undefined;

    await Notice.create({ sender, sender_role, receiver_role, title, message, attachment });
    return res.json({ msg: "Notice Sended Successfully!" });
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const GetAllNotice = async (req, res) => {
  try {
    const notices = await Notice.find();
    return res.json(notices);
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.json({ msg: "Internal Server Error!" });
  }
}

const GetNotice = async (req, res) => {
  try {
    if (!req.query.noticeId) {
      return res.status(400).json({ msg: "Notice id is required!" });
    }
    const notice = await Notice.findById(req.query.noticeId);
    if (!notice) {
      return res.status(404).json({ msg: "Notice not found!" });
    }
    return res.json(notice);
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const DeleteNotice = async (req, res) => {
  try {
    if (!req.query.noticeId) return res.status(400).json({ msg: "Error while deleting notice!" });
    await Notice.findByIdAndDelete(req?.query?.noticeId);
    return res.json({ msg: "Notice Deleted Successfully!" });
  } catch (error) {
    console.log('error in notice.controller.js => ', error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = {
  SendNotice,
  GetAllNotice,
  DeleteNotice,
  GetNotice,
};