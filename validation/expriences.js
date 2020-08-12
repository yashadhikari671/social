const Validator = require('validator');
const isEmpty = require('./is_empty');

const validExprienceInput = (data)=> {
	let  errors = {};

	
	data.title = !isEmpty(data.title) ? data.title : '';
	data.company = !isEmpty(data.company) ? data.company : '';
	data.from = !isEmpty(data.from) ? data.from : '';
	

 	
 	  if (Validator.isEmpty(data.title)){
 	 	errors.title = 'title field is require'; 
 	 }

 	 if (Validator.isEmpty(data.company)){
 	 	errors.company = 'company field is require'; 
 	 }

 	 if (Validator.isEmpty(data.from)){
 	 	errors.from = 'from field is require'; 
 	 }

 	 
 	 return{
 	 	errors:errors,
	 	isValid: isEmpty(errors)  
	 	};
}


 
module.exports = validExprienceInput;

