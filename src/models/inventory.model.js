module.exports = {
    modelName: "inventory",
    tableName: "inventories",
    fields: {
      id: { type: "integer", primary: true, autoIncrement: true },
      inv_id: { type: "string", required: true, label: "Inventory ID" },
      customer: { type: "relation", required: true, label: "Customer", relation: { model: "users", field: "id", display: "name, email", type: "single" } },
      inv_date: { type: "timestamp", required: true, hidden: false, label: "Order Date" },
      status: { type: "enum", values: ["Open", "Closed"], default: "Open", label: "Inventory Status" }
    },
    ui: {
      form: ["inv_id", "customer", "inv_date", "status"],
      table: ["id", "inv_id", "customer","inv_date", "status"],
      layout: 1  // Options: 1 for single column, 2 for two columns, 3 for three columns

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