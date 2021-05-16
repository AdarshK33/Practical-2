'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users_histories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Users_histories.belongsTo(models.Users, {
                foreignKey: 'user_id'
            });
        }
    };
    Users_histories.init({
        user_id: DataTypes.INTEGER,
        activity: DataTypes.STRING
    }, {
        sequelize,
        paranoid: true,
        modelName: 'Users_histories',
    });
    return Users_histories;
};