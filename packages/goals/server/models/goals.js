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
    // tags: [{
    //     type: String
    // }],
    title: {
        type: String,
        required: true,
        trim: true
    },
    childrenGoals: [{
        type: Schema.ObjectId,
        ref: 'Goal'
    }],
    parentGoals: [{
        type: Schema.ObjectId,
        ref: 'Goal'
    }],
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
    invited: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
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
    }],
    commentState: {
        type: Boolean,
        default: false
    }
});

/*
 *  Validations
 */

/*
 *  Statics
 */
GoalSchema.statics.load = function(id, cb) {
    console.log('schema load', this);
    this.findOne({
        _id: id
    })
        .populate('user', 'name username picture')
        .populate('people', 'name username picture')
        .populate('completed', 'name username picture')
        .populate('invited', 'name username picture')
        .populate('missed', 'name username picture')
        .populate('childrenGoals', 'title end')
        .exec(cb);
};

mongoose.model('Goal', GoalSchema);
