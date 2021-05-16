const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const faker = require('faker');
require('dotenv').config();
const { Users, Countries, States, Users_histories, Token } = require("./models");
const { body, validationResult } = require('express-validator');
const { isAuth } = require('./authJWT');

const app = express();
app.use(express.json())

const port = 3002;




app.get('/seeder_run', async function(req, res) {
    try {
        let countryArr = [];
        let stateArr = [];
        for (let i = 0; i < 20; i++) {
            const countryObj = await Countries.build({
                name: faker.address.country(),
                code: faker.address.countryCode()
            }).save();
            for (let j = 0; j < 5; j++) {
                const name = faker.address.state();
                const stateObj = await States.build({
                    name: name,
                    code: name.substr(0, 2),
                    countries_id: countryObj.id
                }).save();
            }
        }
        //  console.log(countryObj)
        res.send({
            status: "success",
            status_code: 200,
            message: "Countries and States Created Successfully In Database",
            data: ""
        });
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }

});

app.post('/user', body('email').isEmail(), body('password').isLength({ min: 6 }), body('phone_no').isLength({ min: 10 }), async(req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: "unauthorized",
                status_code: 400,
                message: errors.message,
                error: ""
            });
        }

        // console.log("called");
        const userObj = await Users.build({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            phone_no: req.body.phone_no,
            gender: req.body.gender,
            profile_img: req.body.profile_img,
            state_id: req.body.state_id
        }).save().catch(e => {
            console.log("exectptioj", e.message);
        });
        // return res.send("succuess");
        // const activityUserObj = await Users_histories.build({ activity: 'user created' });
        // await activityUserObj.save();

        res.send({
            status: "success",
            status_code: 200,
            message: "user Created Successfully",
            data: userObj
        });
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});

app.put('/update_profile', isAuth, async function(req, res) {
    try {
        const userObj = await Users.findOne({
            where: { id: req.user.id },

        });

        userObj.name = req.body.name;
        userObj.phone_no = req.body.phone_no;
        userObj.gender = req.body.gender;


        await userObj.save();
        const activityUserObj = await Users_histories.build({ activity: 'Update_profile', user_id: req.user.id });
        await activityUserObj.save();
        // Now the name was updated to in the database!
        return res.send({
            status: "success",
            status_code: 200,
            message: "updated  display:",
            data: userObj
        });



    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }


});
app.delete('/delete_profile', isAuth, async function(req, res) {
    try {
        const userObj = await Users.findOne({
            where: { id: req.user.id },

        });
        await userObj.destroy();
        const activityUserObj = await Users_histories.build({ activity: 'Delete profile', user_id: req.user.id });
        await activityUserObj.save();
        res.send({
            status: "success",
            status_code: 200,
            message: "deleted:",
            data: userObj

        });


    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }


});

app.get('/profile', isAuth, async function(req, res) {
    try {
        const UserObj = await Users.findOne({
            // where: { id: req.user.id },
            where: { id: req.user.id },
            include: {
                model: States,
                include: {
                    model: Countries
                }
            }
        }).catch((e) => {
            res.send({
                status: "unauthorized",
                status_code: 401,
                message: "User profile ,state ,country list diplay not find",
                error: ""
            })
        })


        const activityUserObj = await Users_histories.build({ activity: 'User Access', user_id: req.user.id });

        await activityUserObj.save();
        // res.json(countryObj);
        res.send({
            status: "success",
            status_code: 200,
            message: "user state country list diplay:",
            data: UserObj

        });

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        });
    }


});
app.get('/country_list', async function(req, res) {
    try {
        const countryObj = await Countries.findAll({ attributes: ['name'] });
        // res.json(countryObj);
        res.send({
            status: "success",
            status_code: 200,
            message: "Countries list diplay:",
            data: countryObj
        });



    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});

app.get('/state_list', async function(req, res) {
    try {
        const StatesObj = await States.findAll({
            include: {
                model: Countries

            }
        });
        // res.json(countryObj);
        res.send({
            status: "success",
            status_code: 200,
            message: "State List based on country:",
            data: StatesObj
        });

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});
app.post('/signin', body('email').isEmail(), body('password').isLength({ min: 6 }), async(req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: "unauthorized",
                status_code: 400,
                message: errors.message,
                error: ""
            });
        }
        const userObj = await Users.findByCredentials(req.body.email, req.body.password)
            .catch((e) => {
                return res.send({
                    status: "bad request",
                    status_code: 400,
                    message: e.message,
                    error: ""
                })
            })
        if (userObj) {
            const token = jwt.sign(userObj, process.env.JWT_KEY);
            Token.build({
                user_id: userObj.id,
                token: token
            }).save();

            const activityUserObj = await Users_histories.build({ activity: 'Login', user_id: userObj.id, });
            await activityUserObj.save();

            return res.send({
                status: "success",
                status_code: 200,
                message: "You have SignIn successfully",
                data: {...userObj, token }
            })
        }

    } catch (error) {
        console.log("error", error.message);
        return res.send({
            status: "error",
            status_code: 500,
            message: "internal server error",
        })

    }

})


app.get('/get_activity', isAuth, async function(req, res) {
    try {
        const Users_historiesObj = await Users_histories.findAll({
            user_id: req.user.id
        });

        res.send({
            status: "success",
            status_code: 200,
            message: "activity list diplay:",
            data: Users_historiesObj
        });

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});
app.post('/logout', isAuth, async function(req, res) {
    try {
        const Token_Obj = await Token.findOne({
            where: { user_id: req.user.id },
        });
        const activityUserObj = await Users_histories.build({ activity: 'Logout', user_id: req.user.id });
        await Token_Obj.destroy();
        await activityUserObj.save();

        res.send({
            status: "success",
            status_code: 200,
            message: "log out: ",
            data: Token_Obj
        });

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});





app.listen(port, () => {
    console.log(`My Demo app listening at http://localhost:${port}`)
})