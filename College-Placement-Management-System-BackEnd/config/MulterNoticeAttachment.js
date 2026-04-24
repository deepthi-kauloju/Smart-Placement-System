const multer = require('multer');
const path = require('path');

const noticeAttachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/noticeAttachments/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadNoticeAttachment = multer({
  storage: noticeAttachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadNoticeAttachment;
