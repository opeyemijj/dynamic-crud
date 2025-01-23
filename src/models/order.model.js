module.exports = {
    modelName: "order",
    tableName: "orders",
    fields: {
      id: { type: "integer", primary: true, autoIncrement: true },
      order_id: { type: "string", required: true, label: "Order ID" },
      customer: { type: "string", required: true, unique: true, label: "Customer" },
      order_date: { type: "timestamp", required: true, hidden: false, label: "Order Date" },
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
  