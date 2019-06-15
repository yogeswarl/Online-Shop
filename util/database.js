const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Yogi2198", {
	dialect: "mysql",
	host: "localhost"
});

module.exports = sequelize;
// the below code is for creating a custom sql.
// const mysql = require("mysql2");
// const pool = mysql.createPool({
// 	host: "localhost",
// 	user: "root",
// 	database: "node-complete",
// 	password: "Yogi2198"
// });

// module.exports = pool.promise();
