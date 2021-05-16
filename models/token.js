'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            // Token.belongsTo(models.Users, {
            //     foreignKey: 'user_id'
            // });
        }
    };
    Token.init({
        user_id: DataTypes.INTEGER,
        token: DataTypes.TEXT
    }, {
        sequelize,

        modelName: 'Token',

    });
    return Token;
};