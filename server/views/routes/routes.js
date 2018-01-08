module.exports = (app) => {
    // const fs = require('fs');
    const cors = require('cors');
    const corsOptions = { exposedHeaders: ['x-auth'] };
    const {
        createUserData,
        readAllData,
        readUserData,
        updateUserData,
        deleteUserData,
        confirmUserData
    } = require('./../../controller/dataHandler');

    const {
        createUser,
        userLogin,
        confirmUser,
        userLogout,
        updateUser
    } = require('./../../controller/userHandler');

    const { authenticate } = require('./../../controller/authenticate');
    const { options, newupload, uploadImage } = require('./../../controller/imageHandler');



    //Routes for user data like courses, bio-data, etc.
    app.post('/data', authenticate, createUserData);
    app.post('/upload/:id', newupload, uploadImage);
    app.get('/data', readAllData);
    app.get('/confirmData', authenticate, confirmUserData)
    app.get('/data/:id', authenticate, readUserData);
    app.put('/data/:id', authenticate, updateUserData);
    app.delete('/data/:id', authenticate, deleteUserData);

    //Routes for the user profile.
    app.post('/users', createUser);
    app.post('/users/login', cors(corsOptions), userLogin);
    app.get('/users/me', authenticate, confirmUser);
    app.delete('/users/me/token', authenticate, userLogout);
    app.patch('/users/:id', authenticate, updateUser);
}