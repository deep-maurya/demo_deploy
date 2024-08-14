const fs = require("fs");
const path = require("path");

const db_file = path.join(__dirname, "db.json");

const get_user_data = () => {
  const data = fs.readFileSync(db_file, "utf-8");
  return JSON.parse(data);
};

const add_user = (users) => {
  fs.writeFileSync(db_file, JSON.stringify(users, null, 2), "utf-8");
};

module.exports = { get_user_data, add_user };