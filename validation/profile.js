const Validator = require('validator');
const isEmpty = require('./is_empty');

const validProfileInput = (data)=> {
	let  errors = {};

	console.log(data.skills)
	console.log(data.handle)
	console.log(data.status)
	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';
	
	console.log(data.skills)
	 if (!Validator.isLength(data.handle,{min:2,max:40})){
 	 	errors.handle = 'handle needs to between 2 and 4 characters'; 
 	 }
 	
 	  if (Validator.isEmpty(data.handle)){
 	 	errors.handle = 'handle field is require'; 
 	 }
 	
 	 
 	  if (Validator.isEmpty(data.status)){
 	 	errors.status = 'status field is require'; 
 	 }
 	  if (Validator.isEmpty(data.skills)){
 	 	errors.skills = 'skills field is require'; 
 	 }
 	 if (!isEmpty(data.website)){
 	 	if(!Validator.isURL(data.website)){
 	 		errors.website = 'Not a valid URL';
 	 	}
 	 }
 	 if (!isEmpty(data.facebook)){
 	 	if(!Validator.isURL(data.facebook)){
 	 		errors.facebook = 'Not a valid URL';
 	 	}
 	 }
 	 if (!isEmpty(data.twiter)){
 	 	if(!Validator.isURL(data.twiter)){
 	 		errors.twiter = 'Not a valid URL';
 	 	}
 	 }
 	 if (!isEmpty(data.instagram)){
 	 	if(!Validator.isURL(data.instagram)){
 	 		errors.instagram = 'Not a valid URL';
 	 	}
 	 }
 	 if (!isEmpty(data.youtube)){
 	 	if(!Validator.isURL(data.youtube)){
 	 		errors.youtube = 'Not a valid URL';
 	 	}
 	 }
 	 return{
 	 	errors:errors,
	 	isValid: isEmpty(errors)  
	 	};
}


 
module.exports = validProfileInput;

