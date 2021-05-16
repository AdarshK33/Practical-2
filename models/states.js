'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class States extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            States.belongsTo(models.Countries, {
                foreignKey: 'countries_id'
            });
        }
    };
    States.init({
        countries_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        code: DataTypes.STRING
    }, {
        sequelize,
        defaultScope: {
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt'
                ]
            },
        },
        modelName: 'States',
    });
    return States;
};