'use strict';
const bcrypt = require('bcrypt');
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Users.belongsTo(models.States, {
                foreignKey: 'state_id'
            });
        }
    };
    Users.init({
        name: {
            type: DataTypes.STRING,

        },
        email: {
            type: DataTypes.STRING,

        },
        password: {
            type: DataTypes.STRING,

        },

        phone_no: {
            type: DataTypes.BIGINT,

        },
        gender: {
            type: DataTypes.ENUM,
            values: [
                "m", "f", "o"
            ]
        },
        profile_img: DataTypes.STRING,
        state_id: DataTypes.INTEGER,
    }, {
        sequelize,
        paranoid: true,
        defaultScope: {
            attributes: {
                exclude: ['password']
            }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        },
        modelName: 'Users',

    });
    Users.findByCredentials = async(email, password) => {
        const userObj = await Users.scope("withPassword").findOne({
            where: { email: email }
        });
        if (!userObj) {
            throw new Error("You are not registered");
        }
        const isMatch = await bcrypt.compare(password, userObj.password);
        if (!isMatch) {
            throw new Error("Password is invalid");
        }
        const newUserObj = Users.findOne({
            where: { id: userObj.id },
            raw: true
        });
        return newUserObj;
    }
    return Users;
};