'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('States', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            countries_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                refrences: {
                    model: {
                        tableName: "Countries",
                    },
                    key: "id"
                }
            },
            name: {
                type: Sequelize.STRING,
            },
            code: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('States');
    }
};