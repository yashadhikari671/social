const Validator = require('validator');
const isEmpty = require('./is_empty');

const validPostInput = (data)=> {
	let  errors = {};

	
	data.text = !isEmpty(data.text) ? data.text : '';
	
	
 	  if (!Validator.isLength(data.text,{min:10, max:300})){
 	 	errors.text = 'post must be between 10 to 300 words'; 
 	 }
 	  if (Validator.isEmpty(data.text)){
 	 	errors.text = 'text field is require'; 
 	 }
 	
 	 
 	 return{
 	 	errors:errors,
	 	isValid: isEmpty(errors)  
	 	};
}


 
module.exports = validPostInput;

