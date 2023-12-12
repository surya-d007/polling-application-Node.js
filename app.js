const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const session = require('express-session');
const { findOne } = require('./models/HostUserModel');
const CredentialsModel = require(__dirname + '/models/credentials');
const HostUserModel = require(__dirname + '/models/HostUserModel');
const PollingModel = require(__dirname + '/models/PollingModel');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Connect to your MongoDB server with the 'notes' database
mongoose.connect(process.env.MONGO_KEY, { useNewUrlParser: true});

const db = mongoose.connection;
db.on("connected", () => {
  console.log("MongoDB is connected to the 'polling-app' database");
});
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/styles'));
app.use(express.static(__dirname + '/views/js'));
app.use(express.static(__dirname + '/views/font'));
app.use(express.static(__dirname + '/views/font'));
app.use(express.static(__dirname + '/views/font/Inter'));
app.use(express.static(__dirname + '/views/Poppins'));
//app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css')) ;
app.use(session({
  secret :' secret-key',
  resave: false,
  saveUninitia1ized: false,
}));










app.get('/' , (req , res)=>{
   res.redirect('/login');
})

app.get('/login' , (req , res)=>{
    
  res.render('login',{error: null})
 })



app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      req.session.email=email;
      console.log(req.session.email + " from /login");
      const user = await CredentialsModel.findOne({ email, password });
      if (user) {
        const Userdata = await HostUserModel.findOne({email});

        if(Userdata){
        
          const base_link = req.protocol + '://' + req.get('host') + "/poll" ;
          res.render('home-details-create-poll' , {Userdata : Userdata , Base_Link : base_link} );
          //res.json(Userdata);
        }
        else  
          res.render('home-details-create-poll' , {Userdata : false });


      } else {
        const userWithEmail = await CredentialsModel.findOne({ email });
        if (userWithEmail) {
          //res.send("Wrong password");
          res.render('login',{error:'Wrong Password'})
        } else {
          //not registed email id 
          //res.redirect('/register');
          res.render('register',{error:'email id is not registered '});
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error during login.");
    }
  });
  
  

app.get('/register' , (req , res)=>{
  res.render('register',{error:null});
})


app.post('/register', async (req, res) => {
    
    const { email, password } = req.body;
    req.session.email=email;
    try {
      const existingUser = await CredentialsModel.findOne({ email });
      if (existingUser) {
        res.send('Email already in use');
      } 
      else {
        const newUser = new CredentialsModel({ email, password });
        await newUser.save();
        

        const user = await CredentialsModel.findOne({ email, password });
        if (user) {
          console.log("one");
        
          
            const base_link = req.protocol + '://' + req.get('host') + "/poll" ;

            res.render('home-details-create-poll' , {Userdata : null , Base_Link : null} );
          }










        //redirect to the home-detiss-cerate-poll
      }
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.get('/create-new-poll' , (req , res)=>{
   res.render('create-poll');
   console.log(req.session.email + " from /cerate-new-poll");

})


app.post('/create-new-poll', async (req, res) => {
  try {
    const userEmail = req.session.email;
    if (!userEmail) {
      return res.status(401).send('User not authenticated');
    }

  
    const pollTitle = req.body.polltitle;
    const description = req.body.description;
    const optionCount = req.body.optionCount;
    const options = [];

    for (let i = 1; i <= optionCount; i++) {
      const key = `opt-${i}`;
      options.push(req.body[key]);
    }


    console.log('User Email:', userEmail);
    console.log('Poll Title:', pollTitle);
    console.log('Option Count:', optionCount);

    const existingUser = await HostUserModel.findOne({ email: userEmail });

    if (existingUser) {
      existingUser.polls.push({
        title: pollTitle,
        noofoptions: optionCount,
        options: options,
      });

      const savedUser = await existingUser.save();
      const savedPoll = savedUser.polls[savedUser.polls.length - 1];

      console.log('New Poll ID:', savedPoll._id); // Log the new Poll ID

      const optionsArray = options.map((optionText) => ({
        optiontext: optionText,
        opted: 0,
      }));

      const pollingUserdata = new PollingModel({
        poll: {
          obj_id : savedPoll._id,
          title: pollTitle,
          description : description,
          noofoptions: optionCount,
          options: optionsArray,
        },
      });

      const savedPollingData = await pollingUserdata.save();
      console.log('Saved Polling Data ID:', savedPollingData._id); // Log the new Polling Data ID

      const Userdata = await HostUserModel.findOne({ email: userEmail });
      if (Userdata) {
        const base_link = req.protocol + '://' + req.get('host') + "/poll" ;
        res.render('home-details-create-poll' , {Userdata : Userdata , Base_Link : base_link} );
      } else {
        console.error('User data not found');
        res.status(404).send('User data not found');
      }
    } 
    
    else {
      const newUser = new HostUserModel({
        email: userEmail,
        polls: [{
          title: pollTitle,
          noofoptions: optionCount,
          options: options,
        }],
      });

      const savedNewUser = await newUser.save();
      const savedNewPoll = savedNewUser.polls[0];



      console.log('New Userpoll ID:', savedNewPoll._id); // Log the new User ID


      const optionsArray = options.map((optionText) => ({
        optiontext: optionText,
        opted: 0,
      }));
      const pollingUserdata = new PollingModel({
        poll: {
          obj_id : savedNewPoll._id,
          title: pollTitle,
          description :description,
          noofoptions: optionCount,
          options: optionsArray,
        },
      });

      const savedPollingData = await pollingUserdata.save();
  
      const Userdata = await HostUserModel.findOne({ email: userEmail });
      if (Userdata) {

        const base_link = req.protocol + '://' + req.get('host') + "/poll" ;
        res.render('home-details-create-poll' , {Userdata : Userdata , Base_Link : base_link} );
      } else {
        console.error('User data not found');
        res.status(404).send('User data not found');
      }
    }
  } catch (error) {
    console.error('Error saving user and poll data to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/delete-poll', async(req, res) => {

  const email = req.session.email;
  const pollIdToDelete = req.query.poll_delete_id;
  const updatedUser = await HostUserModel.findOneAndUpdate(
    { email },
    { $pull: { polls: { _id: pollIdToDelete } } },
    { new: true }
  );
  const result = await PollingModel.findOneAndDelete({ 'poll.obj_id': pollIdToDelete });
    if (result) {
      console.log('Document deleted successfully');
    } else {
      console.log('Document not found or not deleted');
    }


    const Userdata = await HostUserModel.findOne({ email: email });
      if (Userdata) {
        const base_link = req.protocol + '://' + req.get('host') + "/poll" ;
    res.render('home-details-create-poll' , {Userdata : Userdata , Base_Link : base_link} );
}});




app.get('/poll/:_id/:title', async (req, res) => {


  const { _id } = req.params;
  const { title } = req.params;
  console.log('Received _id:', _id);
  console.log('Received title:', title);


  // Validate the ObjectId
  if (!ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Invalid _id' });
  }

  try {
    // Use Mongoose to find the document by _id

    const existingPolldata = await PollingModel.findOne({ 'poll.obj_id': _id });

    if (existingPolldata.poll.title == title) {
      console.log('Found document:', existingPolldata);
      res.render('Polling-public',{ poll : existingPolldata.poll});
    } else {
      console.log('Document not found');
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (err) {
    console.error(err);
    // Handle other errors appropriately
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/voted', async (req, res) => {
  const { objId, optionId } = req.body;
  console.log(objId +" "+ optionId);

  try {
    // Find the poll with the specified obj_id
    const polldata = await PollingModel.findOne({ 'poll.obj_id': objId });

    if (!polldata) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const selectedOption = await polldata.poll.options.find(option => option._id == optionId);
    console.log(selectedOption);
    if (!selectedOption) {
      return res.status(404).json({ error: 'Option not found' });
    }

    // Increment the opted count
    selectedOption.opted += 1;

    // Save the updated poll
    await polldata.save();

    // Redirect back to the poll details page
    res.redirect('/poll/'+polldata.poll.obj_id+'/'+polldata.poll.title);
    
    

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  



app.listen(1000, () => {
    console.log(`Server started on port`);
});

