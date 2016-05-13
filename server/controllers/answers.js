var mongoose = require("mongoose");
var Answer = mongoose.model("Answer");
var Question = mongoose.model("Question");

module.exports = (function(){
   return{
      create: function(req,res){
         var data = req.body;
         var answer = new Answer({content: data.content, user: data.user, details: data.details});
         answer.save(function(err){
            if(err){
               console.log(err);
            }else{
               Question.findOne({_id: data.question}, function(err, question){
                  if(err){
                     console.log(err);
                  }else{
                     question.answers.push(answer);
                     question.save();
                     res.json(answer);
                  }
               })
            }
         })
      },
      like: function(req,res){
         Answer.findOne({_id: req.body.answer}, function(err, answer){
            if(err){
               console.log(err);
            }else{
               answer.likes++;
               answer.save();
               res.json(answer);
            }
         })
      }
   }
})();
