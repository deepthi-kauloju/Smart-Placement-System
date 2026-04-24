const toSafeString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value);
};

const UserDetail = async (req, res) => {
  // console.log(req.user)
  return res.json({
    id: toSafeString(req.user?.id),
    // common data
    first_name: toSafeString(req.user?.first_name),
    middle_name: toSafeString(req.user?.middle_name),
    last_name: toSafeString(req.user?.last_name),
    email: toSafeString(req.user?.email),
    number: toSafeString(req.user?.number),
    password: toSafeString(req.user?.password),
    profile: toSafeString(req.user?.profile),
    gender: toSafeString(req.user?.gender),
    dateOfBirth: toSafeString(req.user?.dateOfBirth),
    createdAt: toSafeString(req.user?.createdAt),

    fullAddress: {
      address: toSafeString(req.user?.fullAddress?.address),
      pincode: toSafeString(req.user?.fullAddress?.pincode),
    },

    role: toSafeString(req.user?.role),
    isProfileCompleted: toSafeString(req.user?.isProfileCompleted),

    // student data
    studentProfile: {
      rollNumber: toSafeString(req.user?.studentProfile?.rollNumber),
      uin: toSafeString(req.user?.studentProfile?.UIN),
      UIN: toSafeString(req.user?.studentProfile?.UIN),
      department: toSafeString(req.user?.studentProfile?.department),
      year: toSafeString(req.user?.studentProfile?.year),
      addmissionYear: toSafeString(req.user?.studentProfile?.addmissionYear),
      gap: toSafeString(req.user?.studentProfile?.gap),
      liveKT: toSafeString(req.user?.studentProfile?.liveKT),
      resume: {
        filename: toSafeString(req.user?.studentProfile?.resume?.filename),
        filepath: toSafeString(req.user?.studentProfile?.resume?.filepath),
        contentType: toSafeString(req.user?.studentProfile?.resume?.contentType),
      },
      SGPA: {
        sem1: toSafeString(req.user?.studentProfile?.SGPA?.sem1),
        sem2: toSafeString(req.user?.studentProfile?.SGPA?.sem2),
        sem3: toSafeString(req.user?.studentProfile?.SGPA?.sem3),
        sem4: toSafeString(req.user?.studentProfile?.SGPA?.sem4),
        sem5: toSafeString(req.user?.studentProfile?.SGPA?.sem5),
        sem6: toSafeString(req.user?.studentProfile?.SGPA?.sem6),
        sem7: toSafeString(req.user?.studentProfile?.SGPA?.sem7),
        sem8: toSafeString(req.user?.studentProfile?.SGPA?.sem8),
      },
      pastQualification: {
        ssc: {
          board: toSafeString(req.user?.studentProfile?.pastQualification?.ssc?.board),
          percentage: toSafeString(req.user?.studentProfile?.pastQualification?.ssc?.percentage),
          year: toSafeString(req.user?.studentProfile?.pastQualification?.ssc?.year)
        },
        hsc: {
          board: toSafeString(req.user?.studentProfile?.pastQualification?.hsc?.board),
          percentage: toSafeString(req.user?.studentProfile?.pastQualification?.hsc?.percentage),
          year: toSafeString(req.user?.studentProfile?.pastQualification?.hsc?.year)
        },
        diploma: {
          board: toSafeString(req.user?.studentProfile?.pastQualification?.diploma?.board),
          percentage: toSafeString(req.user?.studentProfile?.pastQualification?.diploma?.percentage),
          year: toSafeString(req.user?.studentProfile?.pastQualification?.diploma?.year)
        },
      },
    }

  });
}

module.exports = UserDetail;
