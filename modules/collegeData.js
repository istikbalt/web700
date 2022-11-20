const fs = require("fs");
class Data {
	constructor(students, courses) {
		this.students = students;
		this.courses = courses;
	}
}

var dataCollection = null;

module.exports.initialize = function () {
	return new Promise((resolve, reject) => {

		//let studentDataFromFile = null;
       // let courseDataFromFile = null;
       
		fs.readFile("./data/students.json", "utf8", (err, studentD) => {
			if (err) {
				reject("unable to read students.json");
				return;
			}
			let studentData = JSON.parse(studentD); // convert the JSON from the file into an array of objects
		//	console.log(studentData);
		   
			fs.readFile("./data/courses.json", "utf8", (err, courseD) => {
				if (err) {
					reject("unable to read courses.json");
					return;
				}
		let courseData = JSON.parse(courseD); // convert the JSON from the file into an array of objects
		//	console.log(courseData);
				
			dataCollection = new Data(studentData,courseData);
		
				resolve();
			});
		});
	});
}

module.exports.getAllStudents = function () {
	return new Promise(function (resolve, reject) {
		if (dataCollection.students.length === 0) {
			reject("no results returned");
		}

		resolve(dataCollection.students);
	});
};

/*module.exports.getTAs = function () {
	return new Promise(function (resolve, reject) {
		let result = dataCollection.students.filter((s) => s.TA === true);
		if (result.length === 0) {
			reject("no results returned");
		}
		resolve(result);
	});
};*/

module.exports.getCourses = function () {
	return new Promise(function (resolve, reject) {
		if (dataCollection.courses.length === 0) {
			reject("no results returned");
		}

		resolve(dataCollection.courses);
	});
};
module.exports.getStudentsByCourse = function getStudentsByCourse(course) {
    return new Promise(function (resolve, reject) {
        let result = dataCollection.students.filter(function (x) { return x.course==course });
        if (result.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(result);
        }
    });
}

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var updateStudent = null;
       
        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                updateStudent = dataCollection.students[i];
            }
        }

        if (!updateStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(updateStudent);
    })
    };


exports.getCourseById = function getCourseById(id) {
    return new Promise(function (resolve, reject) {
        let result = dataCollection.courses.filter(function (x) { return x.courseId==id });
        if (result.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(result[0]);
        }
    });
}
exports.addStudent = function addStudent(studentData){
    return new Promise(function (resolve, reject) {
        if (typeof studentData.TA === 'undefined') {
            studentData.TA = false;
        }
		else
		{
            studentData.TA = true;
		}
		studentData.studentNum = dataCollection.students.length + 1;
		dataCollection.students.push(studentData);
        resolve(studentData);
    });
}

module.exports.updateStudent  = function(studentData) {
    return new Promise((resolve, reject) => {
        let updatestudentData = dataCollection.students;
            for (let i = 0; i < updatestudentData.length; i++) {
                if(updatestudentData[i].studentNum == studentData.studentNum) {

					updatestudentData[i].firstName = studentData.firstName;
					updatestudentData[i].lastName = studentData.lastName;
					updatestudentData[i].email = studentData.email;
					updatestudentData[i].addressStreet = studentData.addressStreet;
					updatestudentData[i].addressCity = studentData.addressCity;
					updatestudentData[i].addressProvince = studentData.addressProvince;
					updatestudentData[i].TA = studentData.TA;
					updatestudentData[i].status = studentData.status;
					updatestudentData[i].course = studentData.course;
					resolve(studentData);


                }
            }
            resolve();
    });
}