const User = require("../../models/user.model");

const hasRealValue = (value) => (
  value !== undefined &&
  value !== null &&
  value !== "" &&
  value !== "undefined" &&
  value !== "null"
);

// update any user data by admin
const UpdateProfile = async (req, res) => {
  // console.log("hello ", req.body.studentProfile);

  try {
    const user = await User.findById(req.body._id || req.body.id);

    if (!user) return res.status(400).json({ msg: "User Doesn't Exist!" });

    // checking if email which is to update is already there or not 
    if (req.body.email !== user.email) {
      if (await User.findOne({ email: req.body.email }))
        return res.status(400).json({ msg: "Email is Already Exist, Please Enter Another Email!" });
      else
        user.email = req.body.email;
    }


    if (req.body.studentProfile && hasRealValue(req.body.studentProfile.UIN)) {
      if (await User.findOne({ 'studentProfile.UIN': req.body.studentProfile.UIN }) !== null)
        return res.status(400).json({ msg: "UIN is Already Exist, Please Enter Correct UIN!" });
    }

    if (hasRealValue(req.body.first_name)) user.first_name = req.body.first_name;
    if (hasRealValue(req.body.middle_name)) user.middle_name = req.body.middle_name;
    if (hasRealValue(req.body.last_name)) user.last_name = req.body.last_name;
    if (hasRealValue(req.body.number)) user.number = req.body.number;
    if (hasRealValue(req.body.gender)) user.gender = req.body.gender;
    if (hasRealValue(req.body.dateOfBirth)) user.dateOfBirth = req.body.dateOfBirth;
    if (hasRealValue(req.body.profile)) user.profile = req.body.profile;
    if (req.body.fullAddress) {
      if (hasRealValue(req.body.fullAddress.address)) user.fullAddress.address = req.body.fullAddress.address;
      if (hasRealValue(req.body.fullAddress.pincode)) user.fullAddress.pincode = req.body.fullAddress.pincode;
    }

    // Check for student-specific fields
    if (user.role === "student" && req.body.studentProfile) {
      if (hasRealValue(req.body.studentProfile.rollNumber)) user.studentProfile.rollNumber = req.body.studentProfile.rollNumber;
      if (hasRealValue(req.body.studentProfile.UIN)) user.studentProfile.UIN = req.body.studentProfile.UIN;
      if (hasRealValue(req.body.studentProfile.department)) user.studentProfile.department = req.body.studentProfile.department;
      if (hasRealValue(req.body.studentProfile.year)) user.studentProfile.year = req.body.studentProfile.year;
      if (hasRealValue(req.body.studentProfile.addmissionYear)) user.studentProfile.addmissionYear = req.body.studentProfile.addmissionYear;
      if (req.body.studentProfile.gap !== undefined) user.studentProfile.gap = req.body.studentProfile.gap;
      if (hasRealValue(req.body.studentProfile.liveKT)) user.studentProfile.liveKT = req.body.studentProfile.liveKT;

      if (req.body.studentProfile.SGPA) {
        if (hasRealValue(req.body.studentProfile.SGPA.sem1)) user.studentProfile.SGPA.sem1 = req.body.studentProfile.SGPA.sem1;
        if (hasRealValue(req.body.studentProfile.SGPA.sem2)) user.studentProfile.SGPA.sem2 = req.body.studentProfile.SGPA.sem2;
        if (hasRealValue(req.body.studentProfile.SGPA.sem3)) user.studentProfile.SGPA.sem3 = req.body.studentProfile.SGPA.sem3;
        if (hasRealValue(req.body.studentProfile.SGPA.sem4)) user.studentProfile.SGPA.sem4 = req.body.studentProfile.SGPA.sem4;
        if (hasRealValue(req.body.studentProfile.SGPA.sem5)) user.studentProfile.SGPA.sem5 = req.body.studentProfile.SGPA.sem5;
        if (hasRealValue(req.body.studentProfile.SGPA.sem6)) user.studentProfile.SGPA.sem6 = req.body.studentProfile.SGPA.sem6;
        if (hasRealValue(req.body.studentProfile.SGPA.sem7)) user.studentProfile.SGPA.sem7 = req.body.studentProfile.SGPA.sem7;
        if (hasRealValue(req.body.studentProfile.SGPA.sem8)) user.studentProfile.SGPA.sem8 = req.body.studentProfile.SGPA.sem8;
      }

      if (req.body.studentProfile.pastQualification) {
        if (req.body.studentProfile.pastQualification.ssc) {
          if (hasRealValue(req.body.studentProfile.pastQualification.ssc.board)) user.studentProfile.pastQualification.ssc.board = req.body.studentProfile.pastQualification.ssc.board;
          if (hasRealValue(req.body.studentProfile.pastQualification.ssc.year)) user.studentProfile.pastQualification.ssc.year = req.body.studentProfile.pastQualification.ssc.year;
          if (hasRealValue(req.body.studentProfile.pastQualification.ssc.percentage)) user.studentProfile.pastQualification.ssc.percentage = req.body.studentProfile.pastQualification.ssc.percentage;
        }

        if (req.body.studentProfile.pastQualification.hsc) {
          if (hasRealValue(req.body.studentProfile.pastQualification.hsc.board)) user.studentProfile.pastQualification.hsc.board = req.body.studentProfile.pastQualification.hsc.board;
          if (hasRealValue(req.body.studentProfile.pastQualification.hsc.year)) user.studentProfile.pastQualification.hsc.year = req.body.studentProfile.pastQualification.hsc.year;
          if (hasRealValue(req.body.studentProfile.pastQualification.hsc.percentage)) user.studentProfile.pastQualification.hsc.percentage = req.body.studentProfile.pastQualification.hsc.percentage;
        }

        if (req.body.studentProfile.pastQualification.diploma) {
          if (hasRealValue(req.body.studentProfile.pastQualification.diploma.board)) user.studentProfile.pastQualification.diploma.department = req.body.studentProfile.pastQualification.diploma.board;
          if (hasRealValue(req.body.studentProfile.pastQualification.diploma.year)) user.studentProfile.pastQualification.diploma.year = req.body.studentProfile.pastQualification.diploma.year;
          if (hasRealValue(req.body.studentProfile.pastQualification.diploma.percentage)) user.studentProfile.pastQualification.diploma.percentage = req.body.studentProfile.pastQualification.diploma.percentage;
        }
      }
    }

    // check if request came from user except superuser
    if (req.body.role !== 'superuser') user.isProfileCompleted = true;


    // Save the updated user data
    await user.save();

    return res.json({ msg: "Data Updated Successfully!" });
  } catch (error) {
    console.log("user.update-profile.controller ==> ", error)
    return res.json({ msg: "Internal Server Error!" });
  }
}


module.exports = UpdateProfile;
