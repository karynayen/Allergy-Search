var mongoose = require("mongoose");
//POST - title + content
var foodSchema = new mongoose.Schema({
	allergen: String, 
	names: [{type: String}]
	// allergies: {
	// 	gluten: String, 
	// 	dairy: String, 
	// 	soy: String
	// }
}); 

//You need to declare what you are sending out...
module.exports = mongoose.model("Food", foodSchema);
