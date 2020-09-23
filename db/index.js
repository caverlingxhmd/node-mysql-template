'use strict';
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import config from "config-lite";

const basename = path.basename(__filename);
const db = {};
const { use_env_variable, database, username, password } = config.dbOptions
let sequelize;
if (use_env_variable) {
  sequelize = new Sequelize(use_env_variable, config.dbOptions);
} else {
  sequelize = new Sequelize(database, username, password, config.dbOptions);
}

const basedir = path.join(__dirname, "/./models")

fs
  .readdirSync(basedir)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // const model = sequelize['import'](path.join(__dirname, file)); // v5
    const model = require(path.join(basedir, file))(sequelize, Sequelize.DataTypes) // v6
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize
db.Sequelize = Sequelize

export default db;