/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var test_id = ObjectId("507f1f77bcf86cd799439011")
function connect(callback) {
   MongoClient.connect(process.env.DB, function(err, db) {
  if(err) console.error(err);
  callback(db);
  console.log("Server connected");

});
}

  connect((db) => {
    db.collection("test").deleteMany({}, {}, function(err, res) {
      if(err) console.error(err);
      console.log("deleted");
      db.close()
    })
  })

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          var keys = ["issue_title", "issue_text", "created_by", "assigned_to", "status_text"]
          //fill me in too!
          for(var i = 0; i < keys.length; ++i) {
            assert.property(res.body, keys[i], `Should contain field ${keys[i]}`)
          }
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title1',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
          _id: test_id
        })
        .end(function(err, res){
          //console.log(res.body[0])
          assert.equal(res.status, 200);
          
          //fill me in too!
          //assert.property() -- property exists
          assert.equal(res.body.issue_title, "Title1", "issue_title present");
          assert.equal(res.body.issue_text, "text", "issue_text present");
          assert.equal(res.body.created_by, 
            "Functional Test - Required fields filled in", "created_by present");
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title2'
        })
        .end(function(err, res){
       
          assert.equal(res.status, 500);
          assert.typeOf(res.text, "string", "Should return string error")
          //fill me in too!
          
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
         chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: test_id
        })
        .end(function(err, res){
          assert.equal(res.status, 500);
          assert.equal(res.text, "no updated field sent", "should return error")
          //fill me in too!
          
          done();
        });
      });
      
      test('One field to update', function(done) {
          chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: test_id,
          status_text: 'changed, updated text value'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated")
          //fill me in too!
          
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
          chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: test_id,
          status_text: 'changed, updated text value',
          created_by: "John Templeton"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
           assert.equal(res.text, "successfully updated")
          //fill me in too!
          
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_text: "text"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_text: "text", issue_title: "Title"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
       .end(function(err, res) {
          assert.equal(res.text, "_id error");
          done();
        })
      });
      
      test('Valid _id', function(done) {
         chai.request(server)
        .delete('/api/issues/test')
        .send({
         _id: test_id 
        }).end(function(err, res) {
          assert.typeOf(res.text, "string");
          done();
        })
      });
      });
      
    });


