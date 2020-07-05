const Sequelize = require('sequelize')

const sequelize = require('../config/database')

const Notification = sequelize.define('notification', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    content: {
        type: Sequelize.STRING
    },
    notifierId: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    date: {
        type: Sequelize.DATE
    }
});

module.exports = Notification