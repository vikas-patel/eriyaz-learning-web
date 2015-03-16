var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    UserSchema = require('./user.js');

var StudentSchema = UserSchema.extend({
  allExercises : [
    {type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'}
  ],
  activeExercises : [
    {type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'}
  ]
});

module.exports = mongoose.model('Student', StudentSchema);