'use strict';


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
 *  Goal Schema
 */
var GoalSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date
    },
    people: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    completed: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    missed: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: String,
        trim: true
    }]
});

/*
 *  Validations
 */

/*
 *  Statics
 */
GoalSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Goal', GoalSchema);
