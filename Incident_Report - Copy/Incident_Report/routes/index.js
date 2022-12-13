var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//Incidents is the name of the model when referenced, IncidentList is the database that contains the model

/*GET Layout page*/

//Read operation
router.get('/layout', (req, res, next)=>{
  Incidents.find((err, Incidentslist)=>{
      if(err)
      {
          return console.err(err);
      }
      else
      {
          res.render('layout', {Incidents: Incidentslist}); //Rendering the main page and passing the Incident model
      }
  });

});

//Add Operation


//*Get Add Page */
router.get('/Incident_Report', (req, res, next)=>{
  res.render('Incident_Report')
});


//Add Post
router.post('/Incident_Report', (req, res, next)=>{
  let newEntry = Incident ({
      "Username":req.body.Username,
      "Company":req.body.Company,
      "Incident_Date":req.body.Incident_Date,
      "Submission_Date":req.body.Submission_Date,
      "Severity":req.body.Severity,
      "Severity":req.body.Severity,


  });

  Incidents.create(newEntry, (err,Incidents) => {
      if(err)
      {
          consle.log(err);
          res.end(err);
      }
      else
      {
          res.redirect('/layout')
      }
  })
});




module.exports = router;