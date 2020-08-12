const Validator = require('validator');
const isEmpty = require('./is_empty');

const validEducationInput = (data)=> {
	let  errors = {};

	
	data.school = !isEmpty(data.school) ? data.school : '';
	data.degree = !isEmpty(data.degree) ? data.degree : '';
	data.fildofstudy = !isEmpty(data.fildofstudy) ? data.fildofstudy : '';
	data.from = !isEmpty(data.from) ? data.from : '';
console.log(data.fildofstudy)
 	
 	  if (Validator.isEmpty(data.school)){
 	 	errors.school = 'school field is require'; 
 	 }

 	 if (Validator.isEmpty(data.degree)){
 	 	errors.degree = 'degree field is require'; 
 	 }

 	 if (Validator.isEmpty(data.fildofstudy)){
 	 	errors.fildofstudy = 'field of studies field is require'; 
 	 }
 	 if (Validator.isEmpty(data.from)){
 	 	errors.from = 'from field is require'; 
 	 }

 	
 	
 	 return{
 	 	errors:errors,
	 	isValid: isEmpty(errors)  
	 	};
}


 
module.exports = validEducationInput;

