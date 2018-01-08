const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { User } = require('./../../models/user');
const { Data } = require('./../../models/data');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'helloworld@example.com',
    password: 'userOnePass',
    name: 'User One',
    tokens: [{
        _id: new ObjectID(),
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'xingxeng@china.com',
    password: 'userTwoPass',
    name: 'User Two',
    tokens: [{
        _id: new ObjectID(),
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const datas = [{
    _id: new ObjectID(),
    courses: ['Maths101', 'PHY111', 'CHEM101'],
    faculty: 'Engineering',
    department: 'Chemical',
    level: '100L',
    regNo: 'u08ce1002',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    courses: [],
    faculty: 'Science',
    department: 'Biology',
    level: '100L',
    regNo: 'u08bs1003',
    _creator: userTwoId
}];

const populateUsers = done => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo])
    }).then(() => done())
}

const populateDatas = done => {
    Data.remove({}).then(() => {
        return Data.insertMany(datas);
    }).then(() => done());
}

module.exports = { users, populateUsers, datas, populateDatas }