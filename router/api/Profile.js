const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validProfileInput = require('../../validation/profile')
const validExprienceInput = require('../../validation/expriences')
const validEducationInput = require('../../validation/education')
//load profile model
const Profile = require('../../models/Profile');
const User = require('../../models/Users');

router.get('/test',(req,res)=>res.json({msg:"profile route working"}));

router.get('/', passport.authenticate('jwt',{session: false}),(req,res)=>{
	const errors = {};
	//console.log(req.user.name,req.user.avatar)
	Profile.findOne({ user: req.user.id })
	
	//.populate( 'user', ['name', 'avatar'] )
	.then(profile =>{
		if(!profile){
			errors.noprofile = "there is on profile for thsi user"
			return res.status(404).json(errors);
		}
		res.json(profile);
	}).catch(err=> res.status(404).json(err));

});

router.get('/handle/:handle', (req,res)=>{
		 const errors = {};
		Profile.findOne({handle:req.params.handle})
		//.populate('user',['name','avatar'])
		.then(profile=>{
			if(!profile){
				errors.noprofile = 'There is no profile for this user';
				res.status(400).json(errors);

			}
			res.json(profile);
		})
		.catch(err => res.json(err))
});

router.get('/user/:id', (req, res)=>{
	//console.log(req.params.id)
		 const errors = {};
		Profile.findOne({user:req.params.id})
		//.populate('user',['name','avatar'])
		.then(profile=>{

			if(!profile){
				errors.noprofile = 'There is no profile for this user';
				res.status(400).json(errors);

			}
			res.json(profile);
		})
		.catch(err => res.json(err))
});

router.get('/all',(req,res)=>{
	const errors = {}
	Profile.find()
	.then(profiles=>{
		//console.log(profiles)
		if(!profiles){
			errors.profiles = 'there are no profile to display';
			res.status(400).json(errors);
			}

			res.json(profiles);

		
	})
	.catch(err=>res.status(400).json('unable to perform this task'))
});


router.post('/', passport.authenticate('jwt',{session: false}),(req,res)=>{

	const {errors, isValid} = validProfileInput(req.body);

	if(!isValid){
		return res.status(400).json(errors);
	}
	//get filed
	const profileFields = {};
	//console.log(req.user.id)

	profileFields.user = req.user.id;
	if(req.body.handle) profileFields.handle = req.body.handle;
	if(req.body.company) profileFields.company = req.body.company;
	if(req.body.website) profileFields.website = req.body.website;
	if(req.body.location) profileFields.location = req.body.location;
	if(req.body.bio) profileFields.bio = req.body.bio;
	if(req.body.status) profileFields.status = req.body.status;
	if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
	if(typeof req.body.skills !== 'undefined'){
		profileFields.skills = req.body.skills.split(',')
	}
	//social
	profileFields.social = {};
	if(req.body.youtube)profileFields.social.youtube = req.body.youtube;
	if(req.body.facebook)profileFields.social.facebook = req.body.facebook;
	if(req.body.instagram)profileFields.social.instagram = req.body.instagram;
	if(req.body.twiter)profileFields.social.twiter = req.body.twiter;

	
	profileFields.name = req.user.name ;
	profileFields.avatar = req.user.avatar;



	Profile.findOne({user: req.user.id})
	.then(profile =>{
		console.log(profile)
		if(profile){
			//update
			Profile.findOneAndUpdate({user:req.user.id},{$set: profileFields},{new:true})
			.then(profile=>res.json(profile));
		}else{
			//create
				console.log(profileFields.handle)
			//check if handle exists
			Profile.findOne({handle:profileFields.handle})
			.then(profile=>{
				if(profile){
					errors.handle = 'that handle already exists';
					res.status(400).json(errors);
				}
				new Profile(profileFields).save().then(profile=>res.json(profile));
			})

		}
	})
});

router.post('/experience', passport.authenticate('jwt', {session:false}),(req, res)=>{

	const {errors, isValid} = validExprienceInput(req.body);

	if(!isValid){
		return res.status(400).json(errors);
}

	 Profile.findOne({user:req.user.id})
	 .then(profile=>{
	 	const errors = {}
	 	const newExp = {
	 		title: req.body.title,
	 		company: req.body.company,
	 		location: req.body.location,
	 		from: req.body.from,
	 		to: req.body.to,
	 		current: req.body.current,
	 		description: req.body.discription
	 	}
	 	profile.experience.unshift(newExp);

	 	profile.save().then(profile => res.json(profile));
	 })

	 //errors.something='some thing went wrong retry'; 
	 .catch(err=>res.json(err))
	 //console.log('here')
})

router.post('/education', passport.authenticate('jwt', {session:false}),(req, res)=>{

	const {errors, isValid} = validEducationInput(req.body);

	if(!isValid){
		return res.status(400).json(errors);
}

	 Profile.findOne({user:req.user.id})
	 .then(profile=>{

	 	const errors = {}
	 	const newEdu = {
	 		school: req.body.school,
	 		degree: req.body.degree,
	 		fildofstudy: req.body.fildofstudy,
	 		from: req.body.from,
	 		to: req.body.to,
	 		current: req.body.current,
	 		description: req.body.discription
	 	}
	 	console.log(newEdu)
	 	profile.education.unshift(newEdu);

	 	profile.save().then(education1 => res.json(education1));
	 })

	 //errors.something='some thing went wrong retry'; 
	 .catch(err=>res.json(err))
	 //console.log('here')
})
router.delete('/experience/:exp_id', passport.authenticate('jwt',{ session:false}), (req, res)=>{
	//res.json(req.params.exp_id)
	Profile.findOne({user: req.user.id})
	.then(profile=>{
		const removeIndex = profile.experience.map(item => item._id)
		.indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);

		profile.save().then(profile => res.json(profile));
	})
})

router.delete('/education/:edu_id', passport.authenticate('jwt',{ session:false}), (req, res)=>{
	//res.json(req.params.exp_id)
	Profile.findOne({user: req.user.id})
	.then(profile=>{
		const removeIndex = profile.education.map(item => item._id)
		.indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);

		profile.save().then(profile => res.json(profile));
	})
})

router.delete('/', passport.authenticate('jwt',{ session:false}), (req, res)=>{
	Profile.findOneAndRemove({user: req.user.id}).then(()=>{
		User.findOneAndRemove({_id:req.user.id}).then(()=>
			res.json({success:true})
			);
	})
})



module.exports = router;