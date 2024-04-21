const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Customer = require("./models/customers");
const Order = require("./models/order");

const customersData = require("./customers.json");
const ordersData = require("./order.json");

// Database connection
mongoose
  .connect("mongodb://localhost:27017/order", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Save customers
      const savedCustomers = await Customer.insertMany(customersData);

      // Save orders
      // Populate customer field in orders with customer IDs
      const populatedOrders = ordersData
        .map((order) => {
          const customer = savedCustomers.find(
            (cust) => cust.email === order.customerEmail
          );
          if (customer) {
            order.customer = customer._id;
            delete order.customerEmail;
            return order;
          }
          return null;
        })
        .filter((order) => order !== null);

      const savedOrders = await Order.insertMany(populatedOrders);

      // Change discount value
      for (const order of savedOrders) {
        const orderData = ordersData.find(
          (data) => data.orderNumber === order.orderNumber
        );
        if (orderData) {
          order.discount = orderData.discount;
          await order.save();
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", async (req, res) => {
  try {
    res.render("index", { order: null });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async (req, res) => {
  const searchBy = req.body.searchBy;
  const searchValue = req.body.searchValue;
  try {
    let order;

    if (searchBy === "orderId") {
      order = await Order.find({ orderNumber: searchValue }).populate(
        "customer"
      );
      console.log(order);
      res.render("index", { order });
    } else {
      res.render("error");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
