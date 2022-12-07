var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
//connect with the Incidents model
let Incidents = require('../models/incident');


/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('layout', { title: 'Index' });
//});

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
          res.render('index', {Incidents: Incidents}); //Rendering the main page and passing the Incident model
      }
  });

});

//Delete operation
router.get('/delete/:id',(req,res,next) => {
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
router.get('/add', (req, res, next)=>{
  res.render('add')
});


//Add Post
router.post('/add', (req, res, next)=>{
  let newEntry = Incidents ({
      "Username":req.body.Username,
      "Company":req.body.Company,
      "Incident_Date":req.body.Incident_Date,
      "Report_Date":req.body.Report_Date,
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
router.get('/edit/:id',(req,res,next)=> {
  let id = req.params.id;
  Incidents.findById(id,(err,Incidents) =>{
      if(err)
      {
          console.log(err);
          res.end(err);

      }
      else
      {
          res.render('./edit', {title:'Edit Incident', Incidents:Incidents});
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











module.exports = router;
