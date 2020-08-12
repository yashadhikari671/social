const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./config/keys').mongoURL;
const passport = require('passport');
const path = require('path');

const Users =require('./router/api/Users');
const Profile =require('./router/api/Profile');
const Post =require('./router/api/Post');


const app = express();
//body parser middle ware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

 mongoose.set('useNewUrlParser', true);
 mongoose.set('useFindAndModify', false);
 mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db).then(()=>console.log('mangodb connected succesfuly')).catch(err=> console.log(err));



app.use(passport.initialize());


//password config
require('./config/passport')(passport);

//routes
app.use('/api/Users', Users);
app.use('/api/Profile', Profile);
app.use('/api/Post', Post);

if(process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build'));
	app.get('*',(req, res)=>{
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}



const port = process.env.port || 5000;

app.listen(port , ()=>console.log(`server is running on ${port}`));