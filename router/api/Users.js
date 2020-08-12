const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys').jwtsecret;
const passport = require('passport');
//lode input vadilator
const validRegisterInput = require('../../validation/register');
const validLogininInput = require('../../validation/login');
//load user model
const User = require('../../models/Users')

router.get('/test',(req,res)=>res.json({msg:"user route working"}));

router.post('/register',(req,res)=> {
	//console.log(req.body)

	const {errors,isValid } = validRegisterInput(req.body);
	//console.log(errors,isValid)

	 if(!isValid){
	 	return res.status(400).json(errors);
	 }

	
	User.findOne({email: req.body.email }).then(user =>{
		if (user){
			errors.email = 'email already exits'
			return res.status(400).json(errors);		
		}
		else{
			const avater = (`https://robohash.org/${req.body.name}?set=set5`);
			const newUser = new User({
				name:req.body.name,
				email:req.body.email,
				avatar:avater,
				password:req.body.password
			});
			bcrypt.genSalt(10,(err, salt)=>{
				bcrypt.hash(newUser.password, salt, (err, hash)=>{
					if(err) throw err;
					newUser.password = hash;
					newUser.save().then(user=> res.json(user))
					.catch(err=> res.json(err));
				})
			})
		}
	})
});

router.post('/signin',(req,res)=>{
	const email = req.body.email;
	const password = req.body.password;

	const {errors,isValid } = validLogininInput(req.body);
	//console.log(errors,isValid)

	 if(!isValid){
	 	return res.status(400).json(errors);
	 }



	User.findOne({email}).then(user=>{
		if(!user){
			errors.email = 'user not found'
			return res.status(400).json(errors)
		}
//comparing password
	
		bcrypt.compare(password , user.password ).then(ismatch=>{
			if(!ismatch){
				errors.password = 'password incorrect'
				res.status(400).json(errors)
			}else{
//payload
			const payload ={id:user.id, name:user.name, email:user.email , avatar:user.avatar};

//jwt token
			console.log(key)
			jwt.sign(payload, key, { expiresIn: 3600 },(err, token) =>{


  				res.json({
  					keys: key,
  					//msg:"success",
  					token:'Bearer ' + token
  				});
		});
	
			}
			})
	})
})

router.get('/current', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(
        {
        	id:req.user.id,
        	name:req.user.name,
        	email:req.user.email,
        	avatar:req.user.avatar
        }
        	);
    }
);



module.exports = router;