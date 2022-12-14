let mongoose = require('mongoose')

let incidentModel = mongoose.Schema({
    Username: String,
    Company: String,
    Incident_Date: Date,
    Report_Date: Date,
    Incident_Type: String,
    Severity: Number,
    Cost: Number,
    Extra_Notes: String
    },
    {
        collection: "Reports"
    }

)
module.exports = mongoose.model('Incident', incidentModel);
//Incidents is the name of the model when referenced, IncidentList is the database that contains the model