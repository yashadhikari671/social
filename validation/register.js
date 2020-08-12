const Validator = require('validator');
const isEmpty = require('./is_empty');

const validRegisterInput = (data)=> {
	let  errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2= !isEmpty(data.password2) ? data.password2 : '';

 	 if (!Validator.isLength(data.name, {min:3, max: 20})){
 	 	errors.name = "name must be between 3 and 30 character";
 	 }
 	 if (Validator.isEmpty(data.name)){
 	 	errors.name = 'Name field is require'; 
 	 }
 	
 	 if (!Validator.isEmail(data.email)){
 	 	errors.email = 'invlid email'; 
 	 }
 	  if (Validator.isEmpty(data.email)){
 	 	errors.email = 'Email field is require'; 
 	 }
 	
 	 if (!Validator.isLength(data.password,{min:6 , max:30})){
 	 	errors.password = 'password must be atlest 6 charicter'; 
 	 }
 	  if (Validator.isEmpty(data.password)){
 	 	errors.password = 'password field is require'; 
 	 }
 	 
 	 if (data.password !== data.password2){
 	 	errors.password2 = 'password must match'; 
 	 }
 	 if (Validator.isEmpty(data.password2)){
 	 	errors.password2 = 'confirm password field is require'; 
 	 }

 	 return{
 	 	errors:errors,
	 	isValid: isEmpty(errors)  
	 	};
}


 
module.exports = validRegisterInput;

