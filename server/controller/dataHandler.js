const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { Data } = require('./../models/data');


const createUserData = (req, res) => {
    let data = new Data({
        courses: req.body.courses,
        regNo: req.body.regNo,
        department: req.body.department,
        level: req.body.level,
        faculty: req.body.faculty,
        _creator: req.user._id,
        _creatorName: req.user.name,
        createdOn: new Date().getTime()
    });
    data.save().then(doc => {
        res.send(doc);
    }, e => {
        res.status(400).send(e);
    });
};

const readAllData = (req, res) => {
    Data.find({}).then(data => {
        res.send({ data });
    }, e => {
        res.status(400).send(e);
    });
}

const confirmUserData = (req, res) => {
    Data.findOne({
        _creator: ObjectID(req.user._id),
        _creatorName: req.user.name
    }).then(data => {
        if (!data) {
            res.status(404).send();
        }
        res.status(200).send({ data });
    }).catch(e => res.status(400).send());
}

const readUserData = (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Data.findOne({
        _id: ObjectID(id),
        _creator: ObjectID(req.user._id)
    }).then(data => {
        if (!data) {
            res.status(404).send();
        }
        res.status(200).send({ data });
    }).catch(e => res.status(400).send());
};

const updateUserData = (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['courses', 'level', 'department', 'faculty', 'courseTable']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Data.findOneAndUpdate({
        _id: ObjectID(id),
        _creator: ObjectID(req.user._id)
    }, { $set: body }, { new: true }).then(data => {
        if (!data) {
            return res.status(404).send();
        }
        res.status(200).send({ data });
    }).catch(e => res.status(400).send());
}

const deleteUserData = (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Data.findOneAndRemove({
        _id: ObjectID(id),
        _creator: ObjectID(req.user._id)
    }).then(data => {
        if (!data) {
            res.status(404).send();
        }
        res.status(200).send({ data });
    }).catch(e => res.status(400).send());
}

module.exports = { createUserData, readAllData, readUserData, updateUserData, deleteUserData, confirmUserData }