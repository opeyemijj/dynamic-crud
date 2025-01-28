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

  // TRANSFORMATION
  // uppercase
  // lowercase
  // capitalize
  // titlecase
  // money
  // comma
  // datetime
  // comma
  // percentage
  // mask
                       