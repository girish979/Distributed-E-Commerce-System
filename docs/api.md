
1.	Create an order via the Order Service (e.g., using Postman or a browser):

POST http://localhost:3001/orders
BODY 
{
  "orderId": "1234",
  "customerId": "5678",
  "product": "Laptop",
  "quantity": 11
}


2. Get Order
GET http://localhost:3001/orders