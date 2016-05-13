var mongoose = require("mongoose");
var Question = mongoose.model("Question");

module.exports = (function(){
   return{
      index: function(req,res){
         Question.find({}).populate("answers").exec(function(err, questions){
            if(err){
               console.log(err);
            }else{
               res.json(questions);
            }
         })
      },
      create: function(req,res){
         var data = req.body;
         console.log(data)
         var question = new Question({name: data.name, description: data.description, answers: []});
         question.save(function(err){
            if(err){
               console.log(err);
            }else{
               res.json(question);
            }
         })
      },
      show: function(req,res){
         Question.findOne({_id: req.params.id}).populate("answers").exec(function(err, question){
            if(err){
               console.log(err);
            }else{
               res.json(question);
            }
         })
      }
   }
})();
