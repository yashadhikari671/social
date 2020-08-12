const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile')

const validPostInput = require('../../validation/post')


router.get('/test',(req,res)=>res.json({msg:"post route working"}));

router.get('/',(req,res)=>{
	Post.find()
	.sort({date: -1})
	.then(posts => res.json(posts))
	.catch(err=>res.status(400).json(err))
})
router.get('/:id',(req,res)=>{
	Post.findById(req.params.id)
	.then(post => res.json(post))
	.catch(err=>res.status(400).json(err))
})

router.post('/',passport.authenticate('jwt',{session: false}), (req,res)=>{

	const {errors, isValid} = validPostInput(req.body);

	if(!isValid){
		return res.status(400).json(errors);
}
	const newPost = new Post({
		text : req.body.text,
		name : req.body.name,
		avatar : req.body.avatar,
		user : req.user.id
	});
	newPost.save().then(post => res.json(post));
});

router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
	Profile.findOne({user:req.user.id})
	.then(profile =>{
		Post.findById(req.params.id)
		.then(post =>{
		
		//checking the owner of post
		if(post.user.toString() !== req.user.id){
			res.status(401).json({notauthorized: 'user not authorized'})

		}
		//delete
		post.remove().then(()=> res.json({ success: true}));

	})
	.catch(err => res.status(400).json({postnotfound:' no post found'}));
 })
});

router.post('/like/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
	Profile.findOne({user:req.user.id})
	.then(profile =>{
		Post.findById(req.params.id)
		.then(post =>{
		
		if(post.likes.filter(like => like.user.toString()===req.user.id).length > 0){
			return res.status(400).json({ alreadyliked: "user already liked the posts" })
		}

		post.likes.unshift({user: req.user.id})
		post.save().then(post =>res.json(post));

	})
	.catch(err => res.status(400).json({postnotfound:' no post found'}));
 })
});
router.post('/unlike/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
	Profile.findOne({user:req.user.id})
	.then(profile =>{
		Post.findById(req.params.id)
		.then(post =>{
		
		if(post.likes.filter(like => like.user.toString()===req.user.id).length === 0){
			return res.status(400).json({ alreadyliked: "you havent liked the post yet liked the posts" })
		}

		const removeIndex = post.likes
		.map(item => item.user.toString())
		.indexOf(req.user.id);

		post.likes.splice(removeIndex, 1);

		post.save().then(post => res.json(post));

	})
	.catch(err => res.status(400).json({postnotfound:' no post found'}));
 })
});


router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req, res)=>{

	const {errors, isValid} = validPostInput(req.body);

	if(!isValid){
		return res.status(400).json(errors);
}
	Post.findById(req.params.id)
	.then(post=>{
		//console.log(post)
		const newcomment ={
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id
		}
		//console.log(newcomment)
		post.comments.unshift(newcomment);
		//save
		post.save().then(post=> res.json(post))
	})
	.catch(err => res.status(404).json({postnotfound:'no post found'}));
});

router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req, res)=>{

	
	Post.findById(req.params.id)
	.then(post=>{
		//console.log(post.comments, req.params.comment_id)
		if(post.comments.filter(comment =>comment._id.toString()=== req.params.comment_id).length === 0){
			return res.status(400).json({commentnotexists: 'comment does not exist'})
			
		}
		//console.log('hi');
		const removeIndex = post.comments.map(item => item._id.toString())
		//console.log(indexOf(req.params.comment_id),'hii');
		.indexOf(req.params.comment_id);

		post.comments.splice(removeIndex , 1);

		post.save().then(post => res.json(post));
	})
	.catch(err => res.status(404).json({postnotfound:'no post found'}));
})




module.exports = router; 