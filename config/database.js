const Sequelize = require("sequelize");

const sequelize = new Sequelize("esihub", "root", "node-projects", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
