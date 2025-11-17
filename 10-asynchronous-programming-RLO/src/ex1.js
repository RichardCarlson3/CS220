// Exercise 1
// `npm run ex1`

// Dummy function to simulate sending the order to the kitchen.
function sendOrderToKitchen() {
  return Math.floor(Math.random() * 1000);
}

function orderPizza() {
  return new Promise((resolve, reject) => {
    // Simulate a check: is the pizza available? (50/50 chance)
    const isAvailable = Math.random() > 0.5;

    if (isAvailable) {
      const orderId = sendOrderToKitchen(); // a random order id number
      resolve({ orderId: orderId, status: "on the way" });
    } else {
      reject(new Error("Pizza is not available at the moment."));
    }
  });
}

console.log("################  STARTING EXERCISE 1  #################");

const orderPizzaPromise = orderPizza();

const orderPizzaPromiseThen = orderPizzaPromise.then(orderDetails => {
  console.log("Order Details:", orderDetails);
  return 0;
});

orderPizzaPromiseThen.catch(error => {
  console.error("Error:", error.message);
});
