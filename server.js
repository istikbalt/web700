/********************************************************************************* 
* WEB700 � Assignment 06 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: ________ISTIKBAL TURUT______________ Student ID: __144392198____________ Date: _____2022-11-02___________ 
* 
********************************************************************************/
const assignmentData = require('./modules/collegeData1.js');
	var HTTP_PORT = process.env.PORT || 8081;
	const express = require("express");
	const bodyParser = require("body-parser");
	const app = express();
	const path = require('path');
	const exphbs = require('express-handlebars');
	


	app.use(bodyParser.urlencoded({extended: true}));
    

	app.use(function(req,res,next){
		let route = req.path.substring(1);
		app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
		next();
	   });
	   
	
	app.engine('.hbs', exphbs.engine({ 
		extname: '.hbs' , 
		defaultLayout: 'main',
		helpers: {
			navLink: function (url, options) {
				return '<li' +
					((url === app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
					'><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
			},

			equal: function (lvalue, rvalue, options) {
				if (arguments.length < 3)
					throw new Error("Handlebars Helper equal needs 2 parameters");
				if (lvalue !== rvalue) {
					return options.inverse(this);
				} else {
					return options.fn(this);
				}
			}
		}}));

		
	
	app.set('view engine', '.hbs');
	
	app.set('views', './views');

	
	app.get("/", (req,res) => {
		res.render("home");
	});
	
	app.get("/about", (req,res) => {
		res.render("about");
	});
	
	app.get("/htmlDemo", (req,res) => {
		res.render("htmlDemo");
	});
	
	app.get("/students/add", (req, res) => {
		res.render("addStudent");
		
	});


	app.post("/students/add", (req, res) => {
		assignmentData.addStudent(req.body).then(() => {
			res.redirect("/")
		}).catch((error) => {
			res.send({Message : error})
		});
});
	
app.post("/student/update", (req, res) => { 
	assignmentData.updateStudent(req.body).then((value) => {
		res.redirect("/students");
	}).catch((err) => {
		res.send(err);
	});
});

	app.get("/students", (req, res) => {
		if (req.query == null || req.query.course == null)
		{
			assignmentData.getAllStudents().then((value) =>
			        res.render('students', {layout: 'main', students: value})
			).catch((error) =>
			          res.render('students', {layout: 'main', message: error})
			);
		}
		else {
			assignmentData.getStudentsByCourse(req.query.course).then((value) =>
		            	res.render('students', {layout: 'main', students: value})
			).catch((error) =>
			       res.render('students', {layout: 'main', message: error})
			);
		}
	});
	
	app.get("/student/:num", (req, res) => {
		assignmentData.getStudentByNum(req.params.num).then((value) =>
		res.render('student', {student: value})
		).catch((error) =>
		res.render('student', {message: error})
	
		);
	});



	/*app.get("/student/:num", (req, res) => {
		assignmentData.getStudentByNum(req.params.num).then((value) =>
			//res.send(JSON.stringify(value))
			res.render('student', {layout: 'main', student: value})
		).catch((error) =>{
			let unknownStudent = {studentNum: req.params.num};
			//res.send('{message:"' + error + '"}')
		res.render('student', {layout: 'main', student: unknownStudent, message: error})}
		);
	});*/

	
	app.get("/course/:id", (req, res) => {
		assignmentData.getCourseById(req.params.id).then((value) =>
			//res.send(JSON.stringify(value))
			res.render('course', {course: value})
		).catch((error) =>
			//res.send('{message:"' + error + '"}')
			res.render('course', {message: error})
		);
	});

	app.get("/courses", (req, res) => {
		assignmentData.getCourses().then((value) =>
		res.render('courses', {layout: 'main', courses: value})
		).catch((error) =>
		res.render('courses', {layout: 'main', message: error})
		);
	});

	/*app.get("/tas", (req, res) => {
		
		assignmentData.getTAs().then((value) =>
			res.send(JSON.stringify(value))
		).catch((error) =>
			res.send('{message:"' + error + '"}')
		);
	});*/
	app.use(express.static('public'))
	
	app.use(function(req, res, next) {
	  res.send("Page Not Found");
	});

	assignmentData.initialize().then(function(){// setup http server to listen on HTTP_PORT
	app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
	}
).catch((error) =>
    console.log(error)
);


