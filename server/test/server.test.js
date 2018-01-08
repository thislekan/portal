const expect = require('expect');
const request = require('supertest');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { Data } = require('./../models/data');
const { users, populateUsers, datas, populateDatas } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateDatas);

describe('POST /users', () => {
    it('Should create a user', done => {
        var name = 'Mic Check';
        var email = 'word@js.com';
        var password = 'werwed'

        request(app)
            .post('/users')
            .send({ email, password, name })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should return validation errors if request is invalid', done => {
        var password = '!234';
        var email = '1234fr';
        var name = 123;
        request(app)
            .post('/users')
            .send({ email, password, name })
            .expect(400)
            .end(done);
    });

    it('Should not create user if email in use', done => {
        var email = users[0].email;
        var password = users[0].password;
        var name = 'Mike Jones'

        request(app)
            .post('/users')
            .send({ email, password, name })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should log in users and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then(user => {
                    expect(_.pick(user.tokens[1], ['access', 'token'])).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth'],
                    });
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should reject an invalid login', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'sadhhoids'
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toMatch(users[0]._id.toHexString());
                expect(res.body.email).toMatch(users[0].email);
            })
            .end(done);
    });

    it('Should return a 401 if user not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toMatchObject({})
            })
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on log out', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('PATCH /users/:id', () => {
    it('Should update the name of the user', done => {
        var name = 'Ajala Travel';
        request(app)
            .patch(`/users/${users[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ name })
            .expect(200)
            .expect(res => {
                // console.log(res);
                expect(res.body.user.name).toMatch(name);
                expect(res.body.user.email).toMatch(users[0].email);
            }).end(done);
    });

    it('Should not update user via another user', done => {
        var name = 'Ajala Travel';
        request(app)
            .patch(`/users/${users[0]._id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ name })
            .expect(404)
            .end(done);
    });
});

describe('POST /data', () => {
    it('Should create a new data for authenticated user', done => {
        var courses = ['Maths101', 'PHY111'];
        var faculty = 'Engineering';
        var department = 'Chemical';
        var level = '100L';
        var regNo = 'U10ce1009';
        var _creator = users[0]._id;

        request(app)
            .post(`/data`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ courses, faculty, department, level, regNo, _creator })
            .expect(200)
            .expect(res => {
                expect(res.body.courses).toMatchObject(courses);
                expect(res.body.faculty).toBe(faculty);
                expect(res.body.department).toBe(department);
                expect(ObjectID(res.body._creator)).toMatchObject(_creator)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Data.find({ _creator, regNo }).then(data => {
                    expect(data.length).toBe(1);
                    expect(data[0]._id).toBeTruthy();
                    expect(ObjectID(data[0]._creator)).toMatchObject(_creator);
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should not create user data with invalid body data', done => {
        request(app)
            .post('/data')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                Data.find().then(datas => {
                    expect(datas.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /data', () => {
    it('Should return all users data', done => {
        request(app)
            .get('/data')
            .send({})
            .expect(200)
            .end(done);
    })
});

describe('GET /data/:id', () => {
    it('Should return a user data for an authenticated user', done => {
        request(app)
            .get(`/data/${datas[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(ObjectID(res.body.data._id)).toMatchObject(datas[0]._id);
                expect(res.body.data.regNo).toBe(datas[0].regNo);
            })
            .end(done);
    });

    it('Should return a 404 for data created by other users', done => {
        request(app)
            .get(`/data/${datas[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 if data not found', done => {
        request(app)
            .get(`/data/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 for non object IDs', done => {
        request(app)
            .get('/data/123wrr')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PUT /data/:id', () => {
    it('Should update data of an authenticated user', done => {
        var courses = ['BIO112', 'PHY122'];
        var level = '200L';
        request(app)
            .put(`/data/${datas[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ courses, level })
            .expect(200)
            .expect(res => {
                expect(res.body.data.courses).toMatchObject(courses);
                expect(res.body.data.level).toBe(level);
            })
            .end(done);
    });

    it('Should not update data created by other users', done => {
        var level = '200L';
        request(app)
            .put(`/data/${datas[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ level })
            .expect(404)
            .end(done);
    });
});

describe('DELETE /data/:id', () => {
    it('Should delete the data of an authenticated user', done => {
        request(app)
            .delete(`/data/${datas[1]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(ObjectID(res.body.data._id)).toMatchObject(datas[1]._id);
            })
            .end((err, res) => {
                if (err) return done(err);
                Data.findById(datas[1]._id).then(data => {
                    expect(data).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should return a 404 when trying to delete data created by other users', done => {
        request(app)
            .delete(`/data/${datas[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                Data.find(datas[0]._id).then(data => {
                    expect(data).toBeTruthy();
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should return a 404 for non object IDs', done => {
        request(app)
            .delete('/data/1323;df')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 if data not found', done => {
        request(app)
            .delete(`/data/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
})