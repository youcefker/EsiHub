const Sequelize = require('sequelize')

const sequelize = require('../config/database')

const Project = sequelize.define('project', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT,
    },
    projectType: {
        type: Sequelize.STRING
    },
    imagePath: {
        type: Sequelize.STRING
    },
    filespath: {
        type: Sequelize.STRING
    },
    likesNumber: {
        type: Sequelize.INTEGER
    },
    rating: {
        type: Sequelize.DECIMAL
    },
    numberOfRaters: {
        type: Sequelize.INTEGER
    }
    
});

module.exports = Project