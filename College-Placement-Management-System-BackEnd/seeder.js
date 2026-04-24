// ============================================================
//  Smart Placement System — Database Seeder
//  Total: 53 users (1 superuser + 1 management + 1 tpo + 50 students)
//  Run: node seeder.js
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/placement_db';

// ── Schemas ──────────────────────────────────────────────────

const companySchema = new mongoose.Schema({
  companyName: String, companyDescription: String,
  companyWebsite: String, companyLocation: String,
  companyDifficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] }
});
const Company = mongoose.model('Company', companySchema, 'companys');

const jobSchema = new mongoose.Schema({
  jobTitle: String, jobDescription: String, eligibility: String,
  salary: Number, howToApply: String,
  postedAt: { type: Date, default: Date.now },
  applicationDeadline: Date,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  applicants: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    currentRound: { type: String, enum: ['Aptitude Test', 'Technical Interview', 'HR Interview', 'Group Discussion'] },
    roundStatus: { type: String, enum: ['pending', 'passed', 'failed'] },
    selectionDate: Date, joiningDate: Date, offerLetter: String,
    status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now }
  }]
});
const Job = mongoose.model('Job', jobSchema, 'jobs');

const noticeSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  sender_role: { type: String, enum: ['student', 'tpo_admin', 'management_admin', 'superuser'] },
  receiver_role: { type: String, enum: ['student', 'tpo_admin', 'management_admin', 'superuser'] },
  title: String, message: String,
  attachment: { filename: String, filepath: String, contentType: String },
  createdAt: { type: Date, default: Date.now }
});
const Notice = mongoose.model('Notice', noticeSchema, 'notices');

const userSchema = new mongoose.Schema({
  first_name: String, middle_name: String, last_name: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  email: { type: String, required: true, unique: true, trim: true },
  number: Number, password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tpo_admin', 'management_admin', 'superuser'] },
  profile: { type: String, default: '/profileImgs/default/defaultProfileImg.jpg' },
  fullAddress: { address: String, pincode: Number },
  dateOfBirth: Date,
  createdAt: { type: Date, default: new Date() },
  token: String,
  isProfileCompleted: { type: Boolean, default: false },
  studentProfile: {
    isApproved: Boolean, rollNumber: Number,
    UIN: { type: String, sparse: true },
    department: { type: String, enum: ['Computer', 'Civil', 'ECS', 'AIDS', 'Mechanical'] },
    year: { type: Number, enum: [1, 2, 3, 4] },
    addmissionYear: Number,
    gap: { type: Boolean, default: false },
    liveKT: { type: Number, default: 0 },
    SGPA: { sem1: Number, sem2: Number, sem3: Number, sem4: Number, sem5: Number, sem6: Number, sem7: Number, sem8: Number },
    pastQualification: {
      ssc: { board: String, percentage: Number, year: Number },
      hsc: { board: String, percentage: Number, year: Number }
    },
    appliedJobs: [{
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
      package: Number,
      appliedAt: { type: Date, default: Date.now }
    }],
    internships: [{
      type: { type: String, enum: ['Full Time', 'Part Time', 'On-Site', 'Work From Home', 'Other'] },
      companyName: String, companyAddress: String, companyWebsite: String,
      internshipDuration: Number, startDate: Date, endDate: Date,
      monthlyStipend: Number, description: String
    }]
  },
  tpoProfile: { position: String },
  managementProfile: { position: String }
});
const User = mongoose.model('Users', userSchema, 'users');


// ── Student Generator Data ────────────────────────────────────

const firstNames = [
  'Aarav','Sneha','Rahul','Meera','Arjun','Pooja','Vikram','Ananya','Rohan','Kavya',
  'Nikhil','Priya','Siddharth','Divya','Aditya','Neha','Karan','Riya','Amit','Shreya',
  'Varun','Swati','Harsh','Ankita','Yash','Mansi','Tushar','Ishita','Gaurav','Sonali',
  'Omkar','Pallavi','Akash','Rujuta','Pranav','Komal','Shubham','Pratiksha','Nishant','Namrata',
  'Tejas','Deepika','Ajay','Shweta','Santosh','Ashwini','Mahesh','Supriya','Ganesh','Vaishnavi'
];

const lastNames = [
  'Patel','Sharma','Verma','Joshi','Kulkarni','Desai','More','Patil','Shah','Gupta',
  'Singh','Mehta','Nair','Iyer','Rao','Reddy','Kumar','Mishra','Tiwari','Chavan',
  'Jadhav','Shinde','Pawar','Gaikwad','Suryawanshi','Bhosale','Kadam','Mane','Waghmare','Sawant',
  'Deshpande','Kale','Naik','Wagh','Salunke','Shirke','Thorat','Bane','Gade','Khot',
  'Agarwal','Pandey','Yadav','Chauhan','Rajput','Malhotra','Kapoor','Saxena','Srivastava','Tripathi'
];

const departments  = ['Computer', 'Civil', 'ECS', 'AIDS', 'Mechanical'];
const sscBoards    = ['CBSE', 'Maharashtra Board', 'ICSE'];
const hscBoards    = ['CBSE', 'Maharashtra Board', 'ICSE'];
const puneAreas    = ['Shivaji Nagar','Kothrud','Aundh','Baner','Wakad','Pimpri','Chinchwad','Hadapsar','Viman Nagar','Koregaon Park','Deccan','Katraj'];
const pincodes     = [411001,411005,411007,411038,411045,411017,411018,411028,411014,411001];

const rnd  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sgpa = () => parseFloat((rnd(55, 97) / 10).toFixed(1));
const pct  = () => parseFloat((rnd(550, 980) / 10).toFixed(1));

function generateStudent(index, hashedPassword) {
  const firstName  = firstNames[index];
  const lastName   = lastNames[index];
  const year       = pick([3, 4]);
  const admYear    = year === 4 ? 2021 : 2022;
  const liveKT     = rnd(0, 3);
  const semCount   = year === 4 ? 6 : 4;
  const sgpaObj    = {};
  for (let s = 1; s <= semCount; s++) sgpaObj[`sem${s}`] = sgpa();

  return {
    first_name: firstName,
    last_name: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@student.com`,
    number: 9100000000 + index + 1,
    password: hashedPassword,
    role: 'student',
    gender: index % 3 === 0 ? 'Female' : 'Male',
    isProfileCompleted: index < 40,
    fullAddress: {
      address: `${rnd(1, 99)}, ${pick(puneAreas)}, Pune`,
      pincode: pick(pincodes)
    },
    dateOfBirth: new Date(`${rnd(2000, 2003)}-${String(rnd(1,12)).padStart(2,'0')}-${String(rnd(1,28)).padStart(2,'0')}`),
    studentProfile: {
      isApproved: liveKT <= 1,
      rollNumber: (admYear - 2000) * 1000 + (index + 1),
      UIN: `UIN${admYear}${String(index + 1).padStart(3, '0')}`,
      department: pick(departments),
      year,
      addmissionYear: admYear,
      gap: index % 15 === 0,
      liveKT,
      SGPA: sgpaObj,
      pastQualification: {
        ssc: { board: pick(sscBoards), percentage: pct(), year: rnd(2016, 2019) },
        hsc: { board: pick(hscBoards), percentage: pct(), year: rnd(2018, 2021) }
      },
      appliedJobs: [],
      internships: index % 5 === 0 ? [{
        type: pick(['Work From Home', 'On-Site', 'Full Time']),
        companyName: pick(['TechSoft Pvt Ltd', 'Infosys BPO', 'Wipro Intern', 'Capgemini', 'Cognizant']),
        companyAddress: 'Pune, Maharashtra',
        internshipDuration: rnd(1, 6),
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-07-31'),
        monthlyStipend: rnd(5000, 15000),
        description: 'Worked on web development and software testing tasks.'
      }] : []
    }
  };
}


// ── Main Seed Function ────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  await Promise.all([
    Company.deleteMany({}),
    Job.deleteMany({}),
    Notice.deleteMany({}),
    User.deleteMany({})
  ]);
  console.log('🗑️  Cleared existing data');

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // ── 1. ADMIN USERS ───────────────────────────────────────
  const admins = await User.insertMany([
    {
      first_name: 'Super', last_name: 'Admin',
      email: 'superadmin@placement.com',
      number: 9000000001, password: hashedPassword,
      role: 'superuser', gender: 'Male', isProfileCompleted: true,
      fullAddress: { address: 'Admin Block, Main Campus', pincode: 411001 },
      dateOfBirth: new Date('1980-01-15'),
    },
    {
      first_name: 'Rajesh', last_name: 'Sharma',
      email: 'management@placement.com',
      number: 9000000002, password: hashedPassword,
      role: 'management_admin', gender: 'Male', isProfileCompleted: true,
      fullAddress: { address: 'Management Office, Campus', pincode: 411001 },
      dateOfBirth: new Date('1975-05-20'),
      managementProfile: { position: 'Dean of Academics' }
    },
    {
      first_name: 'Priya', last_name: 'Desai',
      email: 'tpo@placement.com',
      number: 9000000003, password: hashedPassword,
      role: 'tpo_admin', gender: 'Female', isProfileCompleted: true,
      fullAddress: { address: 'Placement Cell, Campus', pincode: 411001 },
      dateOfBirth: new Date('1985-08-10'),
      tpoProfile: { position: 'Training & Placement Officer' }
    }
  ]);

  const [superAdmin, mgmtAdmin, tpoAdmin] = admins;
  console.log(`🔐 Created 3 admin users`);

  // ── 2. 50 STUDENTS ───────────────────────────────────────
  const studentDocs = Array.from({ length: 50 }, (_, i) => generateStudent(i, hashedPassword));
  const students    = await User.insertMany(studentDocs);
  console.log(`🎓 Created ${students.length} students`);

  // ── 3. COMPANIES ─────────────────────────────────────────
  const companies = await Company.insertMany([
    {
      companyName: 'Infosys',
      companyDescription: 'Leading global IT services and consulting company headquartered in Bengaluru.',
      companyWebsite: 'https://www.infosys.com',
      companyLocation: 'Bengaluru, Karnataka',
      companyDifficulty: 'Moderate'
    },
    {
      companyName: 'TCS',
      companyDescription: 'Tata Consultancy Services — multinational IT services and consulting company.',
      companyWebsite: 'https://www.tcs.com',
      companyLocation: 'Mumbai, Maharashtra',
      companyDifficulty: 'Easy'
    },
    {
      companyName: 'Persistent Systems',
      companyDescription: 'Software product and technology services company focused on digital transformation.',
      companyWebsite: 'https://www.persistent.com',
      companyLocation: 'Pune, Maharashtra',
      companyDifficulty: 'Moderate'
    },
    {
      companyName: 'NVIDIA India',
      companyDescription: 'Global leader in AI computing and GPU technology.',
      companyWebsite: 'https://www.nvidia.com',
      companyLocation: 'Pune, Maharashtra',
      companyDifficulty: 'Hard'
    },
    {
      companyName: 'Wipro',
      companyDescription: 'Multinational IT, consulting and business process services company.',
      companyWebsite: 'https://www.wipro.com',
      companyLocation: 'Pune, Maharashtra',
      companyDifficulty: 'Easy'
    },
    {
      companyName: 'Capgemini',
      companyDescription: 'Global leader in consulting, technology services and digital transformation.',
      companyWebsite: 'https://www.capgemini.com',
      companyLocation: 'Pune, Maharashtra',
      companyDifficulty: 'Moderate'
    }
  ]);

  const [infosys, tcs, persistent, nvidia, wipro, capgemini] = companies;
  console.log(`🏢 Created ${companies.length} companies`);

  // ── 4. JOBS ───────────────────────────────────────────────
  const batch1 = students.slice(0, 15);
  const batch2 = students.slice(5, 22);
  const batch3 = students.slice(10, 20);
  const batch4 = students.slice(30, 38);
  const batch5 = students.slice(20, 28);

  const rounds      = ['Aptitude Test', 'Technical Interview', 'HR Interview', 'Group Discussion'];
  const roundStatus = ['pending', 'passed', 'failed'];
  const statuses    = ['applied', 'interview', 'hired', 'rejected'];

  const makeApplicants = (batch, hiredCount = 3) =>
    batch.map((s, i) => ({
      studentId: s._id,
      currentRound: pick(rounds),
      roundStatus: pick(roundStatus),
      status: i < hiredCount ? 'hired' : pick(statuses),
      joiningDate: i < hiredCount ? new Date('2025-07-01') : undefined,
      appliedAt: new Date(`2024-${String(rnd(10,12)).padStart(2,'0')}-${String(rnd(1,28)).padStart(2,'0')}`)
    }));

  const jobs = await Job.insertMany([
    {
      jobTitle: 'Software Engineer Trainee',
      jobDescription: 'Join Infosys InStep program. Work on enterprise web apps using Java, Spring Boot, React. 3-month training before project allocation.',
      eligibility: 'B.E./B.Tech CS/IT/ECS. Min 60% aggregate. No active backlogs.',
      salary: 450000,
      howToApply: 'Apply through placement portal. Shortlisted students notified for aptitude test.',
      postedAt: new Date('2024-11-01'),
      applicationDeadline: new Date('2025-01-15'),
      company: infosys._id,
      applicants: makeApplicants(batch1, 4)
    },
    {
      jobTitle: 'Associate Software Developer',
      jobDescription: 'TCS Digital Transformation division — full stack development, data engineering, cloud operations.',
      eligibility: 'B.E./B.Tech all branches. Min 55% aggregate. Max 1 active backlog.',
      salary: 380000,
      howToApply: 'Register on TCS NextStep portal using college code. Online aptitude test.',
      postedAt: new Date('2024-10-15'),
      applicationDeadline: new Date('2024-12-31'),
      company: tcs._id,
      applicants: makeApplicants(batch2, 5)
    },
    {
      jobTitle: 'Full Stack Developer Intern → PPO',
      jobDescription: 'Persistent Systems 6-month paid internship with Pre-Placement Offer for top performers. Node.js, React, MongoDB.',
      eligibility: 'B.E./B.Tech CS/IT/AIDS. Min 65% aggregate. No backlogs. Strong DSA required.',
      salary: 700000,
      howToApply: 'Submit resume and GitHub profile. Selected candidates receive a coding assignment.',
      postedAt: new Date('2024-12-01'),
      applicationDeadline: new Date('2025-02-01'),
      company: persistent._id,
      applicants: makeApplicants(batch3, 2)
    },
    {
      jobTitle: 'AI/ML Engineer',
      jobDescription: 'NVIDIA India — GPU-accelerated deep learning, model optimization, CUDA programming, deployment pipelines.',
      eligibility: 'B.E./B.Tech CS/AIDS/ECS. Min 8.0 CGPA. Strong Python & ML. No backlogs.',
      salary: 1800000,
      howToApply: 'Apply via portal. Online assessment + 2 technical rounds + HR round.',
      postedAt: new Date('2025-01-05'),
      applicationDeadline: new Date('2025-03-01'),
      company: nvidia._id,
      applicants: []
    },
    {
      jobTitle: 'IT Analyst',
      jobDescription: 'Wipro IT Analyst — infrastructure and cloud management, network operations, server management, client support.',
      eligibility: 'B.E./B.Tech all branches. Min 55% aggregate. Max 2 backlogs.',
      salary: 350000,
      howToApply: 'Apply through placement portal. Online aptitude test + HR interview.',
      postedAt: new Date('2025-01-10'),
      applicationDeadline: new Date('2025-03-15'),
      company: wipro._id,
      applicants: makeApplicants(batch4, 3)
    },
    {
      jobTitle: 'Technology Analyst',
      jobDescription: 'Capgemini — digital transformation projects for clients across Europe and North America. SAP, cloud, and DevOps.',
      eligibility: 'B.E./B.Tech CS/IT/ECS. Min 60% aggregate. No active backlogs. Good communication.',
      salary: 420000,
      howToApply: 'Register on Capgemini careers portal. Group discussion + technical + HR rounds.',
      postedAt: new Date('2025-01-20'),
      applicationDeadline: new Date('2025-03-20'),
      company: capgemini._id,
      applicants: makeApplicants(batch5, 2)
    }
  ]);

  console.log(`💼 Created ${jobs.length} jobs`);

  // ── 5. Link appliedJobs back to students ─────────────────
  const jobBatches = [
    { job: jobs[0], batch: batch1 },
    { job: jobs[1], batch: batch2 },
    { job: jobs[2], batch: batch3 },
    { job: jobs[4], batch: batch4 },
    { job: jobs[5], batch: batch5 }
  ];

  for (const { job, batch } of jobBatches) {
    for (const s of batch) {
      const applicant = job.applicants.find(a => a.studentId.toString() === s._id.toString());
      await User.findByIdAndUpdate(s._id, {
        $push: {
          'studentProfile.appliedJobs': {
            jobId: job._id,
            status: applicant ? applicant.status : 'applied',
            package: applicant?.status === 'hired' ? job.salary : undefined,
            appliedAt: applicant?.appliedAt || new Date()
          }
        }
      });
    }
  }
  console.log('📎 Linked applied jobs to students');

  // ── 6. NOTICES ────────────────────────────────────────────
  await Notice.insertMany([
    {
      sender: tpoAdmin._id, sender_role: 'tpo_admin', receiver_role: 'student',
      title: '🏢 Infosys Campus Drive — Applications Open!',
      message: 'Dear Students,\n\nInfosys will conduct an on-campus placement drive on 15th January 2025. Eligible students (CS/IT/ECS, 60%+ aggregate, no active backlogs) must register through the portal by 10th January.\n\nTest: Aptitude (30 min) + Coding (45 min) + Technical Interview + HR.\n\nAll the best!\n— TPO Office',
      createdAt: new Date('2024-11-02')
    },
    {
      sender: tpoAdmin._id, sender_role: 'tpo_admin', receiver_role: 'student',
      title: '📋 Resume Submission Deadline — 20th December',
      message: 'All final year students must submit updated resumes to the placement cell by 20th December 2024. PDF only. Include internships, projects, and skills.\n\nUpload: My Profile → Resume.',
      createdAt: new Date('2024-12-01')
    },
    {
      sender: tpoAdmin._id, sender_role: 'tpo_admin', receiver_role: 'student',
      title: '🚀 Wipro & Capgemini Drives — January 2025',
      message: 'Two major drives in January:\n\n• Wipro IT Analyst — 20th Jan 2025\n• Capgemini Technology Analyst — 28th Jan 2025\n\nRegister on the portal before 15th January. Carry college ID and printed resume.',
      createdAt: new Date('2025-01-05')
    },
    {
      sender: mgmtAdmin._id, sender_role: 'management_admin', receiver_role: 'tpo_admin',
      title: '📊 Placement Statistics Report Required',
      message: 'Dear TPO Team,\n\nFor the Board of Studies meeting on 30th January, we need placement statistics for AY 2024-25 including company-wise offers, department-wise placements, and average/highest packages.\n\nSubmit by 25th January.\n\nRegards,\nDean of Academics',
      createdAt: new Date('2025-01-10')
    },
    {
      sender: tpoAdmin._id, sender_role: 'tpo_admin', receiver_role: 'student',
      title: '🎉 TCS & Infosys Results Announced!',
      message: 'Congratulations to all placed students!\n\n✅ TCS — 5 students placed @ ₹3.8 LPA\n✅ Infosys — 4 students placed @ ₹4.5 LPA\n\nOffer letters at placement cell. Check your portal for updates.\n\nBest of luck to others for upcoming drives!',
      createdAt: new Date('2025-01-18')
    },
    {
      sender: superAdmin._id, sender_role: 'superuser', receiver_role: 'management_admin',
      title: '🔒 System Maintenance on 18th Jan',
      message: 'The placement portal will undergo scheduled maintenance on 18th January 2025 from 11 PM to 3 AM. All services temporarily unavailable. Please inform all concerned staff.\n\n— System Admin',
      createdAt: new Date('2025-01-15')
    },
    {
      sender: tpoAdmin._id, sender_role: 'tpo_admin', receiver_role: 'student',
      title: '📝 Mock Aptitude Test — 5th February',
      message: 'Mock aptitude test on 5th February 2025 in Computer Lab, 10 AM – 12 PM. Preparatory session for Persistent Systems and NVIDIA drives.\n\nMandatory for all final year students. Bring your college ID.',
      createdAt: new Date('2025-01-25')
    }
  ]);
  console.log(`📢 Created 7 notices`);

  // ── Summary ───────────────────────────────────────────────
  const totalPlaced = jobs.reduce((acc, job) =>
    acc + job.applicants.filter(a => a.status === 'hired').length, 0);

  console.log('\n🌱 ══════════════════════════════════════════════');
  console.log('         Seeding Complete! Summary:');
  console.log('══════════════════════════════════════════════════');
  console.log('👥 Total Users : 53');
  console.log('   🔴 superadmin@placement.com   → superuser');
  console.log('   🟡 management@placement.com   → management_admin');
  console.log('   🟢 tpo@placement.com          → tpo_admin');
  console.log('   🔵 50 students                → aarav.patel1@student.com ... vaishnavi.tripathi50@student.com');
  console.log('\n🔑 All passwords  : Password@123');
  console.log('\n🏢 Companies      : 6 (Infosys, TCS, Persistent, NVIDIA, Wipro, Capgemini)');
  console.log(`💼 Jobs           : ${jobs.length} postings`);
  console.log(`🏆 Students hired : ${totalPlaced}`);
  console.log('📢 Notices        : 7');
  console.log('══════════════════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
