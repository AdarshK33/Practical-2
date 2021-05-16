'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },

            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
                validate: {
                    len: {
                        args: [7, 42],
                        msg: "The password length should be between 7 and 42 characters."
                    }
                }

            },
            gender: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: [
                    "m", "f", "o"
                ]
            },
            phone_no: {
                allowNull: false,
                type: Sequelize.BIGINT,
                unique: true,
                validate: {
                    len: {
                        args: [10],
                        msg: "The phone length should be between 10."
                    }
                }
            },
            profile_img: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            state_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                refrences: {
                    model: {
                        tableName: "States",
                    },
                    key: "id"
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    }
};