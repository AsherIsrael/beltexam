var mongoose = require("mongoose");

var AnswerSchema = new mongoose.Schema({
   content: {type: String, required: true},
   user: {type: String, required: true},
   details: String,
   likes: {type: Number, default: 0}
}, {timestamps:true});
mongoose.model("Answer", AnswerSchema);
