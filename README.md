# Dynamic CRUD Application

This project is a dynamic CRUD (Create, Read, Update, Delete) application built using **Node.js**, **Express.js**, **EJS**, and **MySQL**. It provides an intuitive user interface with Bootstrap 5 and allows developers to dynamically define models and manage records efficiently.

## Features
- Dynamic form generation based on model definitions.
- Server-side pagination, sorting, and search functionality.
- CRUD operations (Create, Read, Update, Delete).
- Automatic table creation based on model defination
- SEO-friendly URLs.
- Responsive UI with Bootstrap 5.
- Modular structure for easy maintenance and scalability.
- And more...

## Technologies Used
- **Backend:** Node.js, Express.js, MySQL
- **Frontend:** EJS, Bootstrap 5
- **Database:** MySQL

## Project Structure
```
├── src
│   ├── controllers  # CRUD logic for handling database operations
│   ├── models       # Model definitions
│   ├── routes       # Application routes
│   ├── views        # EJS templates for UI
│   ├── config       # Database configuration
│   ├── public       # Static assets (CSS, JS, Images)
│
├── .env             # Environment variables
├── package.json     # Dependencies and project metadata
├── server.js        # Main entry point
└── README.md        # Project documentation
```

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 14.x)
- MySQL

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/opeyemijj/dynamic-crud.git
   cd dynamic-crud
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and set the following:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=yourdatabase
   PORT=3000
   ```

4. Start the server:
   ```sh
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Defining a Model
To add a new model, create a file inside the `src/models/` directory, e.g., `user.model.js`:
```js
module.exports = {
  modelName: "user",
  tableName: "users",
  fields: {
    id: { type: "integer", primary: true, autoIncrement: true },
    name: { type: "string", required: true, label: "Full Name" },
    email: { type: "string", required: true, unique: true, label: "Email" }
  },
  ui: {
    form: ["name", "email"],
    table: ["id", "name", "email"],
    layout: 2
  }
};
```

### Defining a Model
You can add another model, and create relationship with the user model. You can also use transformation on the data to be displayed. transformation include: uppercase, owercase, capitalize, titlecase,money, comma, datetime, percentage, mask.
the relation field type is a select dropdown and you can have multiple fields in the display for both dropdown and listing, concatenated by space.

```js
module.exports = {
    modelName: "order",
    tableName: "orders",
    fields: {
      id: { type: "integer", primary: true, autoIncrement: true },
      order_id: { type: "string", required: true, label: "Order ID", transform:"money" },
      customer: { type: "relation", required: true, label: "Customer", relation: { model: "users", field: "id", display: "name, email", type: "single" },  transform: "mask"
    },
      order_date: { type: "timestamp", required: true, hidden: false, label: "Order Date", transform: { type: "datetime", format: "DD/MM/YYYY HH:mm", timezone: "UTC" } },
      status: { type: "enum", values: ["Open", "Closed"], default: "Open", label: "Order Status" }
    },
    ui: {
      form: ["order_id", "customer", "order_date", "status"],
      table: ["id", "order_id", "customer","order_date", "status"],
      layout: 3  // Options: 1 for single column, 2 for two columns, 3 for three columns

    },
    validation: {
      customer: "email",
      password: "min:6"
    },
    permissions: {
      admin: ["create", "read", "update", "delete"],
      user: ["read"]
    }
  };
  ```

### CRUD Operations
- **List Records:** `/user`
- **Add New Record:** `/user/create`
- **Edit Record:** `/user/edit/:id`
- **Delete Record:** `/user/delete/:id`

## Contributing

Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, please contact the project maintainers at opeyemijj@gmail.com.
