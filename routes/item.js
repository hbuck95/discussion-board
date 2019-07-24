const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Item = require("../models/item");

router.get("/test", (req, res) => res.json({"message": "This is a test message"}));

router.post("/add", (req, res) => {
    console.log(req.body)

    Item(req.body).save().then(() =>
        res.end("Item added to DB."))
        .catch(err => console.log(err));
});

router.get("/getAll", (req, res) => {
    const errors = {};
    Item.find({})
	.then(items => {
		console.log(items.t);
		if (items === undefined || items.length == 0) {
			errors.noItems = "There are no items!";
			res.status(404).json(errors);
		}
		res.json(items);
	})
	.catch(err => res.status(404).json(err));
});

router.get("/username", (req, res) => {
    const errors = {};
	Item.find({username:req.body.username})
	.then(items => {
		console.log(items.t);
		if (items === undefined || items.length == 0) {
			errors.noItems = "There are no items!";
			res.status(404).json(errors);
		}
		res.json(items);
	})
	.catch(err => res.status(404).json("Something bad happened."));
});

router.delete("/delete", (req,res) => {
	Item.findById(req.body._id).then(item => {
    	item
		  .remove()
		  .then(() => {
			res.json({ Successful: true });
		  })
		  .catch(err =>
			res.status(404).json({ NoItem: "No item found" })
		  );
	  });
});

router.put("/update", (req,res) => {

	const newItem = new Item({
	  username: req.body.username,
	  content: req.body.content
	});
  
	Item.findById(req.body._id)
	  .then(items => {
		if (!items) {
		  errors.noItem = "There are no items with this ID";
		  res.status(404).json(errors);
		}
  
		items
		.remove()
		.then(() => {
		  res.json({ Successful: true });
		})
		.catch(err =>
		  res.status(404).json({ NoItem: "No item found" })
		);
  
		newItem.save().then(item => res.json(item))
		.catch(err => console.log(err));
	  
	  })
	  .catch(err => res.status(404).json({ NoItem: "There is no item with this ID" }));
  
  });

module.exports = router;