const router = require("express").Router(),
  Sale = require("../models/sale"),
  { saleValidation } = require("../middleware/validation"),
  { authToken } = require("../middleware/auth");

router
  .route("") // Get all sales record
  .get(async (req, res) => {
    try {
      const sales = await Sale.find({});
      if (!sales) return res.status(404).send("No sales found");
      res.send(sales);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }) // Create a sale record
  .post(authToken, async (req, res) => {
    console.log("in auth Header", req.headers.usertoken);
    const { error } = saleValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Create new sale along with its owner
    const newSale = {
      ...req.body,
      owner: req.user._id, //owner
    };
    try {
      const sale = await Sale.create(newSale);
      if (!sale) return res.status(400).send("Error creating a sale");
      res.send(sale);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

// Get all the sales created by the current logged-in user
router.get("/me", authToken, async (req, res) => {
  try {
    const sales = await Sale.find({ owner: req.user._id });
    if (sales == "") return res.status(404).send("No sales found");
    res.send(sales);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Show form to create a sale
router.get("/new", authToken, (req, res) => {
  res.send("form to create a new sale");
});

router
  .route("/:id") // Show a specific sale by id
  .get(async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id);
      if (!sale) return res.status(400).send("No sale found");
      res.send(sale);
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
  // Update a specific sale
  .put(async (req, res) => {
    try {
      console.log("body", req.body);
      let resUpdate = Object.keys(req.body); //details received
      //allowed updates
      const allowedUpdates = ["name", "quantity", "price"];
      //filter recieved details to only allowed updates.
      resUpdate = resUpdate.filter((update) => allowedUpdates.includes(update));
      if (resUpdate == "")
        // If res update details are all incorrect
        return res.status(400).send("Not valid updates");

      const updatedSale = {};
      resUpdate.forEach((update) => (updatedSale[update] = req.body[update]));

      console.log("params", req.params.id);
      const updateSale = await Sale.findByIdAndUpdate(
        req.params.id,
        {
          name: updatedSale.name,
          quantity: updatedSale.quantity,
          price: updatedSale.price,
        },
        { new: true }
      );
      if (!updateSale) return res.status(404).send("No sale found to update");
      console.log(updateSale);
      res.send(updateSale);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  })
  // Delete a specific sale based on id
  .delete(async (req, res) => {
    try {
      if (
        !(await Sale.findByIdAndDelete(
          req.params.id /*{_id: req.params.id, owner: req.user._id}*/
        ))
      )
        return res.status(400).send("Unable to delete");
      res.json({ message: "Deleted Success", id: req.params.id });
    } catch (error) {
      console.log(error.message);
      res.status(400).send(error.message);
    }
  });

//Show form to update a specific sale
router.get("/:id/edit", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(401).send("No Sale");
    res.send("Update Sale");
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

module.exports = router;
