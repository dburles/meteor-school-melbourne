Registrations = new Mongo.Collection('registrations');

Registrations.attachSchema(new SimpleSchema({
  name: {
    label: "Name",
    type: String,
    max: 300
  },
  email: {
    label: "Email",
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  gravatar: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        var email = this.field('email').value;
        return email && Gravatar.hash(email);
      }
    }
  }
}));

Registrations.allow({
  insert: function (userId, doc) {
    return true;
  }
});

if (Meteor.isClient) {
  Template.body.onCreated(function() {
    this.subscribe('registrations');
  });

  Template.body.helpers({
    registrations: function() {
      return Registrations.find({}, { sort: { name: 1 }});
    }
  });

  Template.member.helpers({
    gravatarUrl: function() {
      return this.gravatar && Gravatar.imageUrl(this.gravatar, { secure: true }) + '?d=mm&s=200';
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('registrations', function() {
    return Registrations.find({}, { fields: { name: true, gravatar: true }});
  });
}
