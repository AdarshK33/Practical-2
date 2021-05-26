'use strict';


const faker = require('faker');

module.exports = {
    up: async(queryInterface, Sequelize) => {
        let data = [];
        let amount = 50;
        while (amount--) {
            let date = new Date()
            data.push({
                name: faker.address.country(),
                code: faker.address.countryCode(),
                createdAt: date,
                updatedAt: date


            })
        }
        /**
         * Add seed commands here.
         *
         * Example:
         *  */
        await queryInterface.bulkInsert('Countries', data, {});

    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};