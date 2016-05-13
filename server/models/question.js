var mongoose = require("mongoose");

var QuestionSchema = new mongoose.Schema({
   name: {type: String, required: true},
   description: String,
   answers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}]
}, {timestamps:true});
mongoose.model("Question", QuestionSchema);
