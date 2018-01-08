const _ = require('lodash');

const { ObjectID } = require('mongodb');

const { User } = require('./../models/user');

const createUser = (req, res) => {
    let new_user = _.pick(req.body, ['email', 'password', 'name']);
    let user = new User(new_user);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => res.status(400).send(e));
};

const userLogin = (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(e => {
        res.status(400).send();
    });
};

const confirmUser = (req, res) => {
    res.send(req.user);
};

const userLogout = (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
};

const updateUser = (req, res) => {
    var id = req.params.id;
    var token = req.headers['x-auth'];
    var body = _.pick(req.body, ['name']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    User.findOneAndUpdate({
        _id: ObjectID(id),
        'tokens.token': req.headers['x-auth']
    }, { $set: body }, { new: true }).then(user => {
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send({ user });
    }).catch(e => res.status(400).send());
}

module.exports = { createUser, userLogin, confirmUser, userLogout, updateUser };