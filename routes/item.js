const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const Item = require("../models/item");

const validateItemInput = require("../validator/Item");
const encrypt = require("../encryption/encrypt");
const compare = require("../encryption/compare");

router.get("/test", (req, res) => res.json({"message": "This is a test message"}));

router.post("/add", (req, res) => {

	let validation = validateItemInput(req.body);	

	if(!validation.isValid)
		return res.status(400).json(validation.errors);

	encrypt(req.body.email).then(hash => {
		//console.log("Hash is: "+hash);
		req.body.email = hash;

		Item(req.body).save().then(() =>
        	res.end("Item added to DB."))
			.catch(err => console.log(err));
			
	}).catch(err => (console.log(err)));
});

router.get("/getAll", (req, res) => {
    const errors = {};
    Item.find({}, '-email')
	.then(items => {
		if (items === undefined || items.length == 0) {
			errors.noItems = "There are no items!";
			res.status(404).json(errors);
		}
		res.json(items);
	})
	.catch(err => res.status(400).json(err));
});

router.post("/getByUsername", (req, res) => {
    const errors = {};
	Item.find({username:req.body.username})
	.then(items => {
		if (items === undefined || items.length == 0) {
			errors.noItems = "There are no items!";
			res.status(404).json(errors);
		}
		res.json(items);
	})
	.catch(err => res.status(400).json({Error: err}));
});

router.delete("/delete", (req,res) => {
	Item.findById(req.body._id).then(item => {
		bcrypt.compare(req.body.email, item.email).then(isMatch => {
			if(isMatch){			
				item.remove().then(() => {
					res.status(200).json({ message: "Item successfully deleted." });
				}).catch(err => res.status(404).json({ Error: "No item found" }));
			} else {
				return res.status(400).json({message: "Incorrect email"});			
			}
		}).catch(err => res.status(400).json({Error: err}));
	}).catch(err => res.status(400).json({Error:"Item not found"}));    	
});

router.put("/update", (req,res) => {

	Item.findById(req.body._id).then(item => {
		bcrypt.compare(req.body.email, item.email).then(ifMatch => {

			if(ifMatch){
				Item.findByIdAndUpdate(req.body._id, {
					$set:{ 
						username: req.body.username, 
						content: req.body.content
					}}, 
					{
						useFindAndModify:false
					})
				.then(() =>{
					res.json({message: "Item successfully updated."});
				}).catch((err) =>{
					res.json(err);
				});
			} else {
				res.status(400).json({Error:"Incorrect email"});
			}			
		});
	});
});

module.exports = router;
