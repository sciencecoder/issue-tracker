/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
require('dotenv').config();
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
function connect(callback) {
   MongoClient.connect(process.env.DB, function(err, db) {
  if(err) console.error(err);
  callback(db);
  console.log("Server connected");

});
}
 
module.exports = function (app) {



      app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var queries = req.query;
      if(project) {
        connect((db) => {
      
          db.collection(project).find(req.query).toArray(function(err, results) {
            if(err) console.error(err);
            res.send(results);
          })
        })
      }
     else {
       res.status(500).send("cannot find project issue colection name in request query url")
     }
      
    })
    
    .post(function (req, res) {
      var project = req.params.project;
      var data = req.body;
      
      if(project && data.issue_title && data.issue_text && data.created_by) {
        var issueData;
        var date = new Date();
        connect((db) => {
           db.collection(project).findOne({issue_title: data.issue_title}, function(err, issue) {
          if(err) console.error(err);
          if(issue) {
            res.status(500).send("issue already exists");
          } else {
            issueData = req.body;
            issueData.created_on=date.toString();
            issueData.updated_on = date.toString();
            issueData.open=data.open ? data.open : true;
            issueData.assigned_to=data.assigned_to ? data.assigned_to : "";
            issueData.status_text=data.status_text ? data.status_text : "";
            db.collection(project).insertOne(issueData, function(err, issue) {
              if(err) console.error(err);
              res.send(issue.ops[0]);
            })
          }
        })
        })
        
       
      } else {
        res.status(500).send("cannot find one of the required keys for request body: issue_title, issue_text, created_by")
      }
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var data = req.body || {};
      var issueData = {};
      if(Object.keys(data).length <= 1) {
        res.status(500).send("no updated field sent");
      }
      else if(project) {
        for(const key in data) {
          issueData[key] = data[key];
        }
        issueData.updated_on = new Date().toString();
        connect((db) => {
          db.collection(project).updateOne({_id: data._id}, {$set: issueData}, {upsert: false}, function(err, issue) {
          if(err){
            console.error(err);
            res.status(500).send("could not update " + data._id)
          } else {
            res.send("successfully updated");
          }
          
        })
        })
      
      }
     
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(project && req.body._id) {
        connect((db) => {
           db.collection(project).deleteOne({_id: req.body._id}, function(err, db_res) {
          if(err) {
            console.error(err);
            res.status(500).send("could not delete " + req.body._id)
          } else {
            res.send("deleted " +req.body._id)
          }
        })
        })
       
      }
      else {
        res.send("_id error")
      }
    }); 
};
