var mongoose = require("mongoose");
//POST - title + content
var searchSchema = new mongoose.Schema({
	query: String, 
	allergies: [
		{type: String} 
		//{ type: mongoose.Schema.Types.ObjectId, ref: "foodNames" }
	]
	
}); 

//You need to declare what you are sending out...
module.exports = mongoose.model("Search", searchSchema);
