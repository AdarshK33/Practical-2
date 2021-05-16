'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Countries extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Countries.init({
        name: DataTypes.STRING,
        code: DataTypes.STRING
    }, {
        sequelize,
        defaultScope: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        modelName: 'Countries',
    });
    return Countries;
};