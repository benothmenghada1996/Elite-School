// import express module
const express= require ("express");
// import body-parser module
const bodyParser = require("body-parser");
// import bcrypt module
const bcrypt = require("bcrypt");
//import multer module
const multer = require("multer");
//import path module
const path = require("path");
//import mongoose module
const mongoose = require("mongoose");
// //import mongoose-unique-validator
// const uniqueValidator=require("mongoose-unique-validators");
//import axios module
const axios = require("axios");
//import json web token module
const jwt = require("jsonwebtoken");
// import express-session module
const session = require("express-session");

// create express application
const app = express();
//connect express application with DB via mongoose
//KiddosDB: database name
mongoose.connect('mongodb://127.0.0.1:27017/KiddosDB');

//configurations
//Send JSON responses
app.use(bodyParser.json());
//get objects from request
app.use(bodyParser.urlencoded({ extended: true }));
// Session Configuration
const secretKey = 'croco2023';
app.use(session({
    secret: secretKey,
 }));

// Security configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization, expiresIn"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );
    next();
});
// Multer configuration 
// files : shortcut of backend/files
app.use('/files', express.static(path.join('backend/files')))
const MIME_TYPE = {
'image/png': 'png',
'image/jpeg': 'jpg',
'image/jpg': 'jpg',
'application/pdf': 'pdf',
}
const storageConfig = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
  const isValid = MIME_TYPE[file.mimetype];
  let error = new Error("Mime type is invalid");
  if (isValid) {
  error = null;
  }
  cb(null, 'backend/files')
  },
  filename: (req, file, cb) => {
  const name = file.originalname.toLowerCase().split(' ').join('-');
  const extension = MIME_TYPE[file.mimetype];
  const imgName = name + '-' + Date.now() + '-crococoder-' + '.' +
  extension;
  cb(null, imgName);
  }
});
//models importation
const User = require("./models/user");
const Course = require("./models/course");
const Class = require("./models/class");
const Evaluation = require("./models/evaluation");


                      //*******Business Logic Users*********// 
// Business Logic : Signup User
app.post("/users/signup", multer({ storage: storageConfig }).single('fileType'), (req, res) => {
  console.log("Here into BL: Signup", req.body);

  bcrypt.hash(req.body.pwd, 8).then((cryptedPwd) => {
    console.log("Here crypted pwd", cryptedPwd);
    req.body.pwd = cryptedPwd;

    User.findOne({ tel: req.body.tel }).then((existingUser) => {
      if (existingUser) {
        return res.json({ msg: "tel exists" });
      }
      let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        tel: req.body.tel,
        adress: req.body.adress,
        pwd: req.body.pwd,
        role: req.body.role,
      });

      if (user.role === "parent") {
        User.findOne({ tel: req.body.sonTel }).then((doc) => {
          if (!doc || doc.role !== "student") {
            return res.json({ msg: "0" });
          }
          user.sonTel = req.body.sonTel;

          user.save((err, doc) => {
            if (err) {
              return res.json({ msg: "Error" });
            }
            res.json({ msg: "added successfully" });
          });
        });
      } else {
        user.avatar = `http://localhost:3000/files/${req.file.filename}`;
        if (user.role === "teacher") {
          req.body.status = "nok";
          user.speciality = req.body.speciality;
          user.status = req.body.status;
        }
        user.save((err, doc) => {
          if (err) {
            return res.json({ msg: "Error" });
          }
          res.json({ msg: "added successfully" });
        });
      }
    });
  });
});
// Business Logic : Login User
app.post("/users/login", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Login User", req.body);
  let user;
  User.findOne({ tel: req.body.tel })
    .then((findedUser) => {
      console.log("here findedUser", findedUser);
      if (!findedUser) {
        return res.json({msg: "Please check your phone number"});
      } 
      else if (findedUser.status=="nok"){
        return res.json({msg: "Not Validated"});
      }
      else {
        user = findedUser;
        return bcrypt.compare(req.body.pwd, findedUser.pwd);
      }
    })
    .then((cryptedPwd) => {
      console.log("Here crypted pwd", cryptedPwd);
      if (!cryptedPwd) {
        return res.json({ msg: "please check your pwd" });
      } else {
        let userToSend = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          pwd: user.pwd,
          tel : user.tel,
          status : user.status,
          classes: user.classes,
          courses: user.courses,
          sonTel : user.sonTel,
          speciality : user.speciality,
          avatar : user.avatar,
          role: user.role,
        };
        const token = jwt.sign(userToSend, secretKey, { expiresIn:'1h' });
        res.json({ msg: "Welcome", token: token});
      }
    });
});
// Business Logic: Get All Users by Role
app.get("/users/:role", (req, res) => {
  const role = req.params.role;
  // Traitement de la Req
  console.log(`Here into BL: Display all ${role}s`);
  User.find({ role: role }).then((docs) => {
    res.json({response : docs});
  });
});
// Business Logic: Get User By Id
app.get("/users/user/:id", (req, res) => {
  // traitement de la requete
  console.log("Here into BL: Get user By Id",req.params.id);
  let id = req.params.id;
  User.findById(id).then((doc) => {
    if (!doc) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ findedUser: doc });
  });
});
// Business Logic: update teacher status
app.get("/users/updateStatus/:id", (req, res) => {
  let id = req.params.id;
  User.updateOne({ _id: id }, {status : "ok"}).then((response) => {
    console.log("Here response after update", response);
    response.nModified == 1
      ? res.json({ msg: "Edited successfully" })
      : res.json({ msg: "Error" });
  });
});
// Business Logic: Edit User
app.put("/users/editProfile", multer({ storage: storageConfig }).single('fileType'), async (req, res) => {

  console.log("Here into BL: Edited User Profile", req.body);

  User.findOne({tel: req.body.tel}).then((existingUser) => {
    if (existingUser && existingUser._id.toString() !== req.body.id.toString()) {
      return res.json({ msg: "tel exists" });
    }
    let newUser = {
      id: req.body.id,
      email: req.body.email,
      tel: req.body.tel,
      adress: req.body.adress,
      pwd: req.body.pwd,
      role: req.body.role,
    };
    if (newUser.role === "parent"){
      User.findOne({tel: req.body.sonTel }).then((doc) => {
        if (!doc || doc.role!="student") {
          return res.json({ msg: "inexisting sonTel" });
        }
        newUser.sonTel = req.body.sonTel;
      })
    } else {
      if(req.file){
        newUser.avatar = `http://localhost:3000/files/${req.file.filename}`;
      }
      if (newUser.role === "teacher") {
        req.body.status = "ok";
        newUser.speciality = req.body.speciality;
        newUser.status = req.body.status;
      }
    }
    User.updateOne({ _id: newUser.id }, newUser)
    .then((response) => {
      console.log("Here response after update", response);
      response.nModified == 1
        ? res.json({ msg: "Edited successfully" })
        : res.json({ msg: "Error" });
    }); 
  });
});
// Business Logic : delete User By Id
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  User.deleteOne({ _id: userId })
    .then((userDeletion) => {
      if (userDeletion.deletedCount === 1) {
        return Course.deleteMany({ teacherId: userId });
      } else {
        res.json({ msg: "Error deleting user" });
      }
    })
    .then((courseDeletion) => {
      if (courseDeletion && courseDeletion.deletedCount >= 0) {
        return Evaluation.deleteMany({ studentId: userId });
      } else {
        res.json({ msg: "Error deleting associated data" });
      }
    })
    .then((evaluationDeletion) => {
      if (evaluationDeletion && evaluationDeletion.deletedCount >= 0) {
        res.json({ msg: "Data Deleted successfully" });
      } else {
        res.json({ msg: "Error deleting associated data" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.json({ msg: "Error deleting associated data" });
    });
});
// Business Logic : Affect Student To Class
app.put("/users/affectToClass", async (req, res) => {
  try {
    console.log("Here into BL: Affect Student To Class",req.body);
    const updatedUser = req.body;

    const updateUser = await User.updateOne(
      { _id: updatedUser.studentId },
      { $push: { classes: updatedUser.classId, courses: updatedUser.courseId } },
    );

    const updateClass = await Class.updateOne(
      { _id: req.body.classId },
      { $push: { students: updatedUser.studentId } }
    );
    // Mise à jour des cours pour chaque cours dans req.body.courseId
    const updateCourse = req.body.courseId.map(async courseId => {
      await Course.updateOne(
        { _id: courseId },
        { $push: { students: updatedUser.studentId} }
      );
    });

    if (updateUser.nModified === 1 && updateClass.nModified === 1 && updateCourse.nModified === 1 ) {
      res.json({ msg: "Successfully Affected To Class" });
    } else {
      res.json({ msg: "Error" });
    }
  } catch (error) {
    console.error("Error in affectToClass:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
// Business Logic : Affect Teacher To Class
app.put("/users/affectTeacherToClass", async (req, res) => {
  try {
    console.log("Here into BL: Affect Teacher To Class",req.body);
    const updatedUser = req.body;

    // const updateUser = await User.updateOne(
    //   { _id: updatedUser.teacherId },
    //   { $push: { classes: updatedUser.classId} },
    // );
    // Mise à jour du collection classes pour chaque class dans req.body.classId
    const updateClass = await Class.updateMany(
      { _id: { $in: updatedUser.classId } },
      { $push: {courses: updatedUser.courseId } }
    );
    const updateCourse = await Course.updateOne(
      { _id: { $in: updatedUser.courseId } },
      { $push: { classId: updatedUser.classId} }
    );

    if (updateUser.nModified === 1 && updateClass.nModified === 1 && updateCourse.nModified === 1) {
      res.json({ msg: "Successfully Affected To Class" });
    } else {
      res.json({ msg: "Error" });
    }
  } catch (error) {
    console.error("Error in affectToClass:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
// Business Logic: Get User Courses
app.get("/users/:userId/:role/courses",  (req, res) => {
  const { userId, role } = req.params;
  console.log(`Here into BL : Get all ${role === 'teacher' ? 'Teacher' : 'Student'} Courses`);
  try {
  User.findById(userId).populate("courses").then((user) =>{
    if (!user) {
      return res.status(404).json({ message: `${role === 'teacher' ? 'Teacher' : 'Student'} not found` });
    }
    return res.json({ courses: user.courses });
  })
  } catch (error) {
    console.error(`Error in finding courses: ${role}`, error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Business Logic : Get Teacher By courseId
app.get("/users/teacher/:id", (req, res) => {
  // Traitement de la Req
    console.log("Here into BL : Get Teacher By CourseId", req.params.id);
    try {
      Course.findById(req.params.id)
        .populate("teacherId")
        .then((course) => {
      if (!course) {
          return res.status(404).json({ message: "Course not found" });
      }
        const teacher = course.teacherId;
        if (!teacher) {
          return res.status(404).json({ message: "Teacher not found" });
        }
      res.json({teacher});
    });
    } catch (error) {
      console.error("Error while finding courses :", error);
      res.status(500).json({ msg: "Internal server error" });
    }
});
// Business Logic: Get students by identifier (course or class)
app.get("/users/students/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  try {
    console.log(`Here into BL: Get Students For ${type === 'course' ? 'Teacher Course' : 'Class'}`, id);

    if (type === 'course') {
      const course = await Course.findById(id).populate('students');
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const students = course.students;
      res.json({ students });
    } else if (type === 'class') {
      const classe = await Class.findById(id).populate('students');

      if (!classe) {
        return res.status(404).json({ message: "Class not found" });
      }

      const students = classe.students;
      res.json({ students });
    } else {
      return res.status(400).json({ message: "Invalid type specified" });
    }
  } catch (error) {
    console.error(`Error fetching students for ${type}:`, error);
    res.status(500).json({ message: `An error occurred while fetching students for ${type}` });
  }
});

// Business Logic : Get Student By tel
app.get("/users/student/:id", (req, res) => {
  console.log("Here into BL : Get Student By tel", req.params.id);
  // Traitement de la Req
  let tel = req.params.id;
  User.find({ tel : tel }).then((doc) => {
      res.json({ mySon : doc });
  });
});
// Business Logic : Search teacher by speciality
app.post("/users/searchTeacher", (req, res) => {
  console.log("Here into BL: Search teacher by speciality",req.body);
  // Traitement de la Req
  User.find({ speciality: req.body.speciality }).then((doc) => {
      res.json({ teachers: doc });
  });
});



                       //*******Business Logic Classes*********// 
// Business Logic : getAllClasses
app.get("/classes", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Get all classes");
  Class.find().then((docs) => {
    res.json({ classesTab : docs });
  });
});
// Business Logic : add Class
app.post("/classes", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Add match", req.body);
  let classe = new Class(req.body);
  classe.save();
  res.json({ msg: "added successfully" });
});
// Business Logic : edit Class
app.put("/classes", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Edit Class", req.body);
  let newClass = req.body;
  Class.updateOne({ _id: newClass._id }, newClass).then((response) => {
    console.log("Here response after update", response);
    response.nModified == 1
      ? res.json({ msg: "Edited successfully" })
      : res.json({ msg: "Error" });
  });
});
// Business Logic : delete Course By Id
app.delete("/classes/:id", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Delete Class By Id", req.params.id);
  let id = req.params.id;
  Class.deleteOne({ _id: id }).then((response) => {
    console.log("Here response after delete", response);
    response.deletedCount == 1
      ? res.json({ msg: "Deleted successfully" })
      : res.json({ msg: "Error" });
  });
});
// Business Logic : getClassesById
app.get("/classes/:id", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Get class By Id", req.params.id);
  Class.findOne({ _id: req.params.id }).then((doc) => {
    res.json({ class: doc });
  });
});
// Business Logic : Get User Classes
app.get("/classes/:userId/:role", async (req, res) => {
  const { role, userId } = req.params;

  try {
    console.log(`Here into BL : Get ${role === 'teacher' ? 'Teacher' : 'Student'} Classes`, userId);

    let classesQuery;
    if (role === 'teacher') {
      classesQuery = Class.find({ teachers: userId }).populate('teachers');
    } else if (role === 'student') {
      classesQuery = Class.find({ students: userId }).populate('students');
    } else {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const classes = await classesQuery.exec();
    console.log(`Here classesTab`, classes);

    if (role === 'teacher') {
      res.json({ classesTab: classes });
    } else if (role === 'student' && classes.length > 0) {
      res.json({  classesTab:classes[0] });
    } else {
      res.json({  classesTab: null });
    }
  } catch (error) {
    console.error('Error in Get Classes', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




                      //*******Business Logic Courses*********// 
// Business Logic : getAllCourses
app.get("/courses", (req, res) => {
    // traitement de la requete
    console.log("Here into BL : Get all courses");
    Course.find().then((docs) => {
      res.json({ coursesTab: docs });
    });
});
// Business Logic : addCourse
app.post("/courses", multer({ storage: storageConfig }).single('img'),(req, res) => {
  // traitement de la requete
  console.log("Here into BL : Add Course", req.body);
  try{
      // find User by ID
      User.findById(req.body.teacherId).then((user) => {
        console.log(req.body.teacherId);
        if (!user) {
        return res.status(404).json({ msg: "User not found" });
        }
        req.body.avatar = `http://localhost:3000/files/${req.file.filename}`

        let course = new Course({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            avatar : req.body.avatar,
            teacherId: req.body.teacherId,
        });
        course.save((err, doc) => {
          // Add course to user  
          user.courses.push(course);
          user.save();
          res.status(201).json({msg:"done"});
        });
      });
    } catch (error) {
      console.log("Here error", error);
    }
});
// Business Logic : editCourse
app.put("/courses", multer({ storage: storageConfig }).single('img'), (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Edit Course", req.body);
  try {
    let newCourse = req.body;
    if (req.file) {
      newCourse.avatar = `http://localhost:3000/files/${req.file.filename}`;
    }
    Course.findById(newCourse.id).then((existingCourse) => {
      if (!existingCourse) {
        return res.status(404).json({ msg: "Course not found" });
      }
      Course.updateOne({ _id: newCourse.id }, newCourse).then((response) => {
        console.log("Here response after update", response);
        response.nModified == 1
          ? res.json({ msg: "Edited successfully" })
          : res.json({ msg: "Error" });
      });
    });
  } catch (error) {
    console.log("Here error", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
// Business Logic : deleteCourseById
app.delete("/courses/:id", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Delete course By Id", req.params.id);
  let id = req.params.id;
  Course.deleteOne({ _id: id }).then((response) => {
    console.log("Here response after delete", response);
    response.deletedCount == 1
      ? res.json({ msg: "Deleted successfully" })
      : res.json({ msg: "Error" });
  });
});
// Business Logic : getCourseById
app.get("/courses/:id", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Get course By Id", req.params.id);
  Course.findOne({ _id : req.params.id }).then((doc) => {
    res.json({ course: doc });
  });
});
// Business Logic : Get courses by classId 
// app.get("/courses/class/:classId", (req, res) => {
//   console.log("Here into BL : Get class courses", req.params.classId);
//   // Traitement de la Req
//   let id = req.params.classId;
//   Course.find({ classId : id }).then((docs) => {
//       console.log("Here courses", docs);
//       res.json({ courses: docs });
//   });
// });
app.get("/courses/class/:classId", async(req, res) => {
  try {
    console.log("Here into BL: Get class courses", req.params.classId);

    const classId = req.params.classId;

    // Utilisation de populate pour remplacer la référence de classe par les documents réels
    const courses = await Course.find({ classId: classId }).populate('classId');

    console.log("Here courses", courses);

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching courses by classId:", error);
    res.status(500).json({ message: "An error occurred while fetching courses by classId" });
  }
});

// Business Logic : Search Course By son tel
app.post("/courses/searchBySonTel", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Get All Courses By SonTel", req.body);
  User.findOne({ tel: req.body.sonTel }).then((existingUser) => {
    if (!existingUser) {
      return res.json({ msg: "User Not Found" });
    } else {
      Course.find({students : existingUser._id}).then((existCourses) => {
        return res.json({ courses: existCourses });
      })
    }
  });
});

                                       //*******Business Logic Note And Evaluation*********// 

// Business Logic : add Note and Evaluation
app.post("/noteEvaluations", (req, res) => {
  // traitement de la requete
  console.log("Here into BL : Add  Note and Evaluation", req.body);
  try{
      let evaluation = new Evaluation({
        note: req.body.note,
        evaluation: req.body.evaluation,
        courseId: req.body.courseId,
        teacherId : req.body.teacherId,
        studentId: req.body.studentId,
      });
      evaluation.save((err,doc) => {
        (err)
        ? res.json({ msg: "Error"})
        : res.json({ msg: "added successfully" });
      });
    } catch (error) {
      console.log("Here error", error);
    }
});
// Business Logic : Get Student Note And Evaluation
app.post("/noteEvaluations/student", (req, res) => {
  console.log("Here into BL : Get Student Note And Evaluation", req.body);

  Evaluation.find({ studentId: req.body.studentId, courseId: req.body.courseId })
    .populate('studentId') 
    .then((docs) => {
      res.json({ NoteEvaluat: docs });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});


                                     //*******Business Logic API*********// 
// Business Logic : get temp in Tunisia
app.get("/users/weather/city", (req, res) => {
  const key = "438ce0b208c9cda6ffe0b796eb0f1184";
  const city = "Tunis"; 
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  
  axios.get(apiURL)
    .then((weatherResult) => {
      const response = weatherResult.data.main;
      const weatherToSend = {
        temperature: response.temp,
        icon: `https://openweathermap.org/img/wn/${weatherResult.data.weather[0].icon}@2x.png`,
      };
      res.json({ response: weatherToSend});
    })
    .catch((error) => {
      console.error("Error fetching weather data", error);
      res.status(500).json({ message: "Error fetching weather data" });
    });
});
//Business Logic : récupérer l'heure pour une région donnée depuis OpenWeatherMap
app.get("/users/time/city", async (req, res) => {
  const key = "438ce0b208c9cda6ffe0b796eb0f1184";
  const city = "Tunis"; 
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  axios.get(apiURL)
    .then((response) => {
      const timestamp = response.data.dt; // Timestamp UNIX
      const time = new Date(timestamp * 1000).toLocaleTimeString(); // Convertir le timestamp UNIX en heure locale
      res.json({ result: time });
    })
    .catch((error) => {
      console.error("Error fetching weather data", error);
      res.status(500).json({ message: "Error fetching weather data" });
    });
});


module.exports = app;