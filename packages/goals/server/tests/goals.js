'use strict';

/**
 *  module dependencies
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Goal = mongoose.model('Goal');

/**
 *  Globals
 */
var user;
var goal;

/**
 *
 */
describe('<Unit Test>', function() {
    describe('Model Goal:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.save(function() {
                    goal = new Goal({
                    title: 'Article Title',
                    description: 'Article Description',
                    user: user
                });
                done();
            });

        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return goal.save(function(err) {
                    should.not.exist(err);
                    goal.title.should.equal('Article Title');
                    goal.description.should.equal('Article Description');
                    goal.user.should.not.have.length(0);
                    goal.created.should.not.have.length(0);
                    done();
                });
            });

            it('should be able to show an error when trying to save without title', function(done) {
                goal.title = '';

                return goal.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to save without description', function(done) {
                goal.description = '';

                return goal.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when trying to save without user', function(done) {
                goal.user = '';

                return goal.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        });
        afterEach(function(done) {
            goal.remove();
            user.remove();
            done();
        });
    });
});
