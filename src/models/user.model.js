module.exports = {
    modelName: "user",
    tableName: "users",
    fields: {
      id: { type: "integer", primary: true, autoIncrement: true },
      name: { type: "string", required: true, label: "Full Name" },
      email: { type: "string", required: true, unique: true, label: "Email Address" },
      password: { type: "password", required: true, hidden: false, label: "Password" },
      status: { type: "enum", values: ["active", "inactive"], default: "active", label: "Account Status" }
    },
    ui: {
      form: ["name", "email", "password", "status"],
      table: ["id", "name", "email", "status"],
      layout: 1  // Options: 1 for single column, 2 for two columns, 3 for three columns

    },
    validation: {
      email: "email",
      password: "min:6"
    },
    permissions: {
      admin: ["create", "read", "update", "delete"],
      user: ["read"]
    }
  };
  