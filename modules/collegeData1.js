const Sequelize = require('sequelize');
var sequelize = new Sequelize('xnruszcz', 'xnruszcz', '1E4eZXnFjuLFO6eZdBHoudHzM_OEsbrv', {
	host: 'peanut.db.elephantsql.com',
	dialect: 'postgres',
	port: 5432,
	dialectOptions: {
	ssl: { rejectUnauthorized: false }
	},
	query:{ raw: true }
   });

   sequelize
   .authenticate()
   .then(function () {
	 console.log("Connection has been established successfully.");
   })
   .catch(function (err) {
	 console.log("Unable to connect to the database:", err);
   });

  

   var Student = sequelize.define("Student", {
	studentNum: {
	  type: Sequelize.INTEGER,
	  primaryKey: true,
	  autoIncrement: true, 
	},
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING,
	addressStreet: Sequelize.STRING,
	addressCity: Sequelize.STRING,
	addressProvince: Sequelize.STRING,
	TA: Sequelize.BOOLEAN,
	status: Sequelize.STRING,
  });
  
  var Course = sequelize.define("Course", {
	courseId: {
	  type: Sequelize.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
	},
	courseCode: Sequelize.STRING,
	courseDescription: Sequelize.STRING,
  });
  

  Course.hasMany(Student, { foreignKey: "course" });


  module.exports.initialize = function () {
	return new Promise((resolve, reject) => {
	  sequelize
		.sync()
		.then(function () {
		  resolve();
		})
		.catch(() => {
		  reject("unable to sync the database");
		});
	});
  };
  

  module.exports.getAllStudents = function () {
	return new Promise((resolve, reject) => {
	  Student.findAll()
		.then((data) => {
		  resolve(data);
		})
		.catch(() => {
		  reject("no results returned");
		});
	});
  };


  module.exports.getCourses = function () {
	return new Promise((resolve, reject) => {
	  Course.findAll()
		.then((data) => {
		  resolve(data);
		})
		.catch(() => {
		  reject("no results returned");
		});
	});
  };

module.exports.getStudentsByCourse = function (course) {
	return new Promise((resolve, reject) => {
	  Student.findAll({ where: { course: course } })
		.then((data) => {
		  resolve(data);
		})
		.catch(() => {
		  reject("no results returned");
		});
	});
  };

  module.exports.getStudentByNum = function (num) {
	return new Promise((resolve, reject) => {
	  Student.findAll({ where: { studentNum: num } })
		.then((data) => {
		  resolve(data[0]);
		})
		.catch(() => {
		  reject("no results returned");
		});
	});
  };
  module.exports.getCoursebyId = function (id) {
	return new Promise((resolve, reject) => {
	  Course.findAll({ where: { courseId: id } })
		.then((data) => {
		  // console.log(data);
		  resolve(data[0]);
		})
		.catch(() => {
		  reject("no results returned");
		});
	});
  };

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (var prop in studentData) {
      if (studentData[prop] == "") {
        studentData[prop] = null;
      }
    }

    Student.create(studentData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to create student");
      });
  });
};


module.exports.updateStudents = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (var prop in studentData) {
      if (studentData[prop] == "") {
        studentData[prop] = null;
      }
    }

    Student.update(studentData, {
      where: { studentNum: studentData.studentNum },
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to update student");
      });
  });
};



module.exports.addCourse = function (courseData) {
  return new Promise((resolve, reject) => {
    for (var prop in courseData) {
      if (courseData[prop] == "") {
        courseData[prop] = null;
      }
    }
    Course.create(courseData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to add course");
      });
  });
};


module.exports.updateCourse = function (courseData) {
  return new Promise((resolve, reject) => {
    for (var prop in courseData) {
      if (courseData[prop] == "") {
        courseData[prop] = null;
      }
    }
    Course.update(courseData, { where: { courseId: courseData.courseId } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to update course");
      });
  });
};


module.exports.deleteCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({ where: { courseId: id } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Cannot delete course");
      });
  });
};

module.exports.deleteStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({ where: { studentNum: studentNum } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Cannot delete student");
      });
  });
};