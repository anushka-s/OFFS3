var con 	   = require("../../models/mysql"),
 	ses        =   require('node-ses'),
 	async      =  require('async'),
 	controller = require("../../models/config"),
    nodemailer = require('nodemailer');

module.exports = {

	index: function (req, res) {

	},

	initials: function(req,res) {
		console.log('teacher initials');
		console.log(req.query);
		var college_name = req.query.college_name;
		var ins_id 	 = req.query.ins_id;
		var password	 = req.query.password;
		var query 		 = 'select * from '+ 'employee where instructor_id = ? and password = ?';
		console.log(college_name, ins_id, password);
	    if(college_name != null && ins_id != null && password != null) {		//Check For all fields
			con.query(query,[ins_id,password],function(error,result) {
				console.log(result);
			if(error) {
				console.log(error);
				var obj = { status:400 , message :"There is error in query!"};
				res.json(obj);

			} else if(result[0] == null) {
				var obj = { status:400 , message :"No Such User Found ! ."};
				res.json(obj);  		// Invalid Password or username

			} else {
				console.log(result[0]);
				req.session.ins = result[0];
				req.session.ins.college_name = req.query.college_name;
				console.log(req.session.ins);
				var obj = { status:200 , message :"Teacher authentication Successfull"};
				res.json(obj);  	 //Successfull
			}

		})}	else {
			console.log("Not All Fields Set")
			var obj = { status:400 , message :"Not All Fields Set"};
			res.json(obj);
		}
	},

	checksession : function(req,res) {
		/*  This route is just to check if sessions are working .
			Hit this url once you have logged in.	*/
			if(req.session.ins) {
				console.log(req.session.ins);
				res.json(req.session.ins);
			}

			else
			{
				console.log("No session detected");
				var obj = {status:200,message:"No session detected"} ;
			}
	},


	populate : function(req, res) {

		var ins_id = req.session.ins.instructor_id;
		var year = 2017;
		var college_name = req.session.ins.school;
/*		query= "*********************";

		con.query(query, function(err,result) {
			if (err) {
				console.log(err);

				res.json()
			}

			if (result) {

				var lastResult = iske andar sab hoga

				lastResult = {
					subname: [], 
					semester:[]
				}

				var obj = {
					statusCode : 200,
					lastResult	
				}
				res.json(lastResult) 
			}

		})*/

		console.log('In populate');
//		var year = req.query.year;

		var tables = {
			       batch_allocation    :college_name + '_batch_allocation_',
				   subject_allocation :college_name + '_subject_allocation_',
			}

//subject_name, course, stream, semester


		var query =	' select * from '+ tables.subject_allocation+' as s  ' +
				   	' inner join  '+ tables.batch_allocation+' as b on s.batch_id = b.batch_id ' +
				   	
				   	' where s.instructor_code = ' +ins_id+ ' ;'
				   	;
				   	console.log(query);

		con.query(query,function(error,result) {
				console.log(result);
			if(error) {
				console.log(error);
				var obj = { status:400 , message :"There is error in query!"};
				res.json(obj);

			} else if(result[0] == null) {
				var obj = { status:400 , message :"Oops ! ."};
				res.json(obj);

			} else {
				console.log(result[0]);
				var obj = { status:200 , message :"Successfull"};
				res.json(obj);  	 //Successfull
			}

		})

	},



	dashboard	: function(req,res) {
		console.log('In dashboard');
		var year = req.query.year;
		var college_name = req.query.college_name;
		var subject_type  =req.query.subject_type;
		var subject_name = req.query.subject_name;
		var course = req.query.course;
		var stream = req.query.stream;
		var semester = Number(req.query.semester);

		var ins_id = req.session.ins.instructor_id;

		if(year==null|| subject_type==null || subject_type==null || subject_name==null || course==null || stream==null|| semester==null) {
			console.log(year)
			console.log(subject_type)
			var obj = { status:400 , message :"Not All Fields Set"};
			res.json(obj);
		}
		else
		{   var tables = {
			       batch_allocation    :college_name + '_batch_allocation_',
				   subject_allocation :college_name + '_subject_allocation_' ,
				   feedback		   	  :college_name + '_feedback_'          + year,
		   		   employee			  :'employee'
		   	}

		   	console.log(tables);

			var query =	' select * from '+ tables.subject_allocation+' as s  ' +
					   	' inner join  '+ tables.batch_allocation+' as b on s.batch_id = b.batch_id ' +
					   	' inner join  '+ tables.employee+' as e on s.instructor_code =e.instructor_id '+
					   	' inner join  '+ tables.feedback+' as f on s.feedback_id = f.feedback_id' +

					   	' where b.course = ? and b.stream = ? and b.semester = ? and s.type = ? and s.instructor_code =' + ins_id +';' 

					   	;
					   	console.log(query);
		    con.query(query,[course,stream,semester,subject_type],function(error,result){
		    	if(error) {
					console.log(error);
					var obj = { status:400 , message :"There is error in query!"};
					res.json(obj);       // Connection Error
				}
				else if(result[0]==null){
					console.log("No Teacher Found");
					var obj = { status:400 , message :"No Such User Found ! ."};
					res.json(obj);  		// Invalid Password or username
				}
				else{
					console.log("Data fetched");
					console.log(result);
					res.json(result);

				}
		    })
		}
	}
}
