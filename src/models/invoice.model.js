module.exports = {
    modelName: "invoice",
    tableName: "invoices",
    fields: {
      id: { type: "integer", primary: true, autoIncrement: true },
      invoice_id: { type: "string", required: true, label: "Invoice ID" },
      sales_order_id: { type: "string", required: true, label: "Sales Order ID" },
      customer: { type: "string", required: true, unique: true, label: "Customer" },
      invoice_date: { type: "timestamp", required: true, hidden: false, label: "Invoice Date" },
      status: { type: "enum", values: ["Open", "Closed"], default: "Open", label: "Invoice Status" }
    },
    ui: {
      form: ["invoice_id", "sales_order_id", "customer", "invoice_date", "status"],
      table: ["id", "invoice_id", "sales_order_id", "customer","invoice_date", "status"],
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
  