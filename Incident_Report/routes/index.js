var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let passport = require('passport');
const { title } = require('process');
//connect with the Incidents model
let Incidents = require('../models/incident');


//connect with User model
let userModel = require('../models/user');
let User = userModel.User;



function requireAuth(req, res, next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login')
    }
    next();
}


router.get('/about', function(req, res, next) {
    res.render('about');
   });


//Incidents is the name of the model when referenced, IncidentList is the database that contains the model
  
/*GET Layout page*/

//Read operation
router.get('/', (req, res, next)=>{
  Incidents.find((err, Incidents)=>{
      if(err)
      {
          return console.err(err);
      }
      else
      {
        
        res.render('index', 
           {Incidents: Incidents,
           displayName: !req.user ? '':req.user.username}
        ); //Rendering the main page and passing the Incident model while passing
      }
    
  });

});

//Delete operation
router.get('/delete/:id',requireAuth,(req,res,next) => {
  let id = req.params.id;
  Incidents.deleteOne({_id:id},(err)=>{
      if(err)
      {
          console.log(err);
          res.end(err);
      }
      else
      {
          res.redirect('/');
      }

  })


})


//Add Operation


//*Get Add Page */
router.get('/add',requireAuth,(req, res, next)=>{
  res.render('add')
});


//Add Post
router.post('/add',requireAuth, (req, res, next)=>{

    let today = new Date()
    let newEntry = Incidents ({
      "Username":req.body.Username,
      "Company":req.body.Company,
      "Incident_Date":req.body.Incident_Date,
      "Report_Date":today,
      "Incident_Type":req.body.Incident_Type,
      "Severity":req.body.Severity,
      "Cost":req.body.Cost,
    });

    Incidents.create(newEntry, (err,Incidents) => {
        
        if(err)
        {
          consle.log(err);
          res.end(err);
        }
        else
        {
          res.redirect('/')
        }
    })
});


//Edit Get
router.get('/edit/:id', requireAuth,(req,res,next)=> {
  let id = req.params.id;
  Incidents.findById(id,(err,Incidents) =>{
      if(err)
      {
          console.log(err);
          res.end(err);

      }
      else
      {
          console.log(req.user.username)
          res.render('./edit', {title:'Edit Incident', Incidents:Incidents}, req.user ? req.user.displayName:'');
          
      }
  })
});


//Edit Post

router.post('/edit/:id', (req, res, next)=>{
  let id =req.params.id;
  let IncidentsToEdit = Incidents({
      "_id":id,
      "Username":req.body.Username,
      "Company":req.body.Company,
      "Incident_Date":req.body.Incident_Date,
      "Report_Date":req.body.Report_Date,
      "Incident_Type":req.body.Incident_Type,
      "Severity":req.body.Severity,
      "Cost":req.body.Cost,

  });
  Incidents.updateOne({_id:id}, IncidentsToEdit,(err)=>{
      if(err)
      {
          conse.log(err);
          res.end(err);
      }
      else
      {
          res.redirect('/')
      }       
  });

});

//get router for login page

router.get('/login', (req, res, next) => {
    if (!req.user)
    {
        res.render('./user_auth/login',
        {
            title: 'login',
            message: req.flash('loginMessage'),
            //displayName: req.user ? req.user.displayName: ''
        })
    }
    else
    {
        return res.redirect('/')
    }
  });

//post login page
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => 
    {
        //server error
        if (err)
        {
            return next(err);
        }
        if(!user)
        {
            req.flash('loginMessage', 
            'AuthenticationError');
            return res.redirect('/login')
        }
        req.login(user, (err) => {
            if(err)
            {
                return next(err)
            }
            return res.redirect('/');

        })

    }) (req,res,next)
});


//get router for registration page

router.get('/registration', (req, res, next) => {
    if (!req.user)
    {
            res.render('./user_auth/registration',{
            title: 'Reigster',
            message: req.flash('registrationage'),
            //displayName: req.user ? req.user.displayName: ''
        })
    }
    else
    {   
        return res.redirect('/')
    }


});

//post registration page
router.post('/registration', (req, res, next) => {
    let newUser = User({
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName
    });
    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
         console.log("error adding new user");
         console.log(err)
            if(err.name=="UserExistsError")
            {
                req.flash('registarMessage',
                'Registration Error: user already exists');
            }
            return res.render('./user_auth/registration',
            {
                title:'Register',
                message: req.flash('registerMessage'),
            });
        }
        else
        {
            //if registration is not successful
            return passport.authenticate('local')(req,res,()=>{
                res.redirect('/');
            })
        }

    })


});


//perform logout

router.use('/logout',(req, res,next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }


    });
    res.redirect('/');

});

module.exports = router;
