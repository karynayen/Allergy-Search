var express = require("express"),
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"), 
	request = require("request"), 
	Search = require("./models/search.js"),
	Food = require("./models/foodNames.js");
var async = require("async"); 


mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/allergy2", {useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//make a seed file later
// var newFood = {allergen: "dairy", names: ["dairy", "milk", "lactose", "butter", "caesin", "cheese", "cream", "cruds", "custard", "ghee", "hydrolysates", "whey", "yogurt", "Lactulose", "Galactose" ]}; 
// 	Food.create(newFood, function(err, newlyCreated){
// 		if(err){
// 			console.log(err); //change later
// 		} else{
// 			console.log(newlyCreated); 
// 			// var id = newlyCreated._id; 
// 			// res.redirect("/search/results/" + id);
// 		}
// 	});	
	
// var newFood = {allergen: "gluten", names: ["gluten", "wheat", "barley", "bulgur", "durum", "farro", "faro", "dinkel", "malt", "spelt",   ]}; 
// //leaving oat out...
	


app.get("/", function(req, res){ 
	//res.render("landing");
	res.redirect("/search"); 
}); 

app.get("/search", function(req, res){ 
	res.render("search");	
});

function findAllergen(allergenKey){
	return new Promise(function(resolve, reject){
		var found = false;
		var allergen; 
		Food.find({allergen: allergenKey}, function(err, foundAllergen){
			if(err){
				console.log(err); 
			}else{
			
				found = true; 
				allergen = foundAllergen; 
				console.log("foundAllergen: " + allergen);
				if(found){
					resolve(allergen); 
				} else{
					reject("error has arrived"); 
				}
			}		
		}); 
	})
}
app.post("/search", function(req,res){
	var item = req.body.food;
	var allergies = req.body.allergy;
	var keys = []; 
	var newSearch;
	var listOfAllergens = [];
	if(allergies != null){
		keys = Object.keys(allergies);
	}

	keys.forEach(function(allergenKey){
         findAllergen(allergenKey).then(function(fromResolve){
            listOfAllergens.push(fromResolve); 
        }).then(function(){
			console.log("list of allergens now: " + listOfAllergens); 
			res.send("done!!!");
		}).catch(function(fromReject){
            console.log(fromReject); 
		}); 
    });
	newSearch = {query: item, allergies: listOfAllergens};
	Search.create(newSearch, function(err, newlyCreated){
		if(err){ 
			console.log(err); //change later
		} else{
			var id = newlyCreated._id; 
			console.log(newlyCreated); 
			res.send("done!!!");
			//res.redirect("/search/results/" + id);
		}
	});	
	
	
	
});
app.get("/search/results/:id", function(req,res){
	//var item = req.params.food;  //get info from url
	var id = req.params.id; 
	Search.findById(id, function(err, search){
		if(err){
			console.log(err);
		}else{
			// res.render("results"{search})
				var url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=PcKN7VFIxAIm2wrLWW45sI9c5eL2S3gijyNfTMh0&query=" + search.query;
				request(url, function(error, response, body){
					var data = JSON.parse(body); 
					if(data.Response === "False"){
						res.send("error: " + data.Error); 
					}
					else if(!error && response.statusCode == 200){
						//console.log(data);
						res.send("it works"); 
						//res.render("results", {results: data, search: search});	
					}	
				});
		}
	})

}); 



app.listen(3000, function(){
	console.log("***server is listening***")
})




// app.post("/search", function(req,res){
// 	var item = req.body.food;
// 	var allergies = req.body.allergy;
// 	var keys = []; 
// 	var listOfAllergens = [];
// 	if(allergies != null){
// 		keys = Object.keys(allergies);
// 	}
// 	keys.forEach(function(allergenKey){
// 		Food.find({allergen: allergenKey}, function(err, foundAllergen){
// 			if(err){
// 				console.log(err); 
// 			}else{
// 				listOfAllergens.push(foundAllergen); 
// 				console.log("foundAllergen: " + foundAllergen); 
// 			}
// 		}); 
// 	}); 
// 	console.log("list of allergens now (which is empty): " + listOfAllergens); 
// 	res.send("done!!!");
// });


// 	async.eachSeries(keys, function(allergenKey, cb){
// 		Food.find({allergen: allergenKey}, function(err, foundAllergen){
// 				if(err){
// 					console.log(err); 
// 				}else{
// 					listOfAllergens.push(foundAllergen); 
// 					console.log("foundAllergen: " + foundAllergen);
// 				}
// 		}); 
// 	}, function(err, results){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("list of allergens now: " + listOfAllergens); 
// 			res.send("done!!!");
// 		}	
// 	});