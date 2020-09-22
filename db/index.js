'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/./config/config.json'))[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
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

module.exports = db;

// npx sequelize-cli model:generate --name project_info --attributes project_id:integer,project_name:string,icon_uri:string,dev_uri:string,test_uri:string,pre_uri:string,prod_uri:string,bussiness_type:integer,desc:string,git_address:string