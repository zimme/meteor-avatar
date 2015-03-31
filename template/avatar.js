Template.avatar.helpers({

  size: function () {
    var valid = ['large', 'small', 'extra-small'];
    return _.contains(valid, this.size) ? 'avatar-' + this.size : '';
  },

  dimensions: function () {
    var value;
    if      (this.size === 'large')       value = 80;
    else if (this.size === 'small')       value = 30;
    else if (this.size === 'extra-small') value = 20;
    else                                  value = 50;

    return { width: value, height: value };
  },

  shape: function () {
    var valid = ['rounded', 'circle'];
    return _.contains(valid, this.shape) ? 'avatar-' + this.shape : '';
  },

  hasImage: function () {
    return Template.instance().hasImage.get();
  },

  imageUrl: function () {
    var user = this.user ? this.user : Meteor.users.findOne(this.userId);
    return Avatar.getUrl(user);
  },

  initialsCss: function () {
    var css = '';
    if (this.bgColor)  css += 'background-color: ' + this.bgColor + ';';
    if (this.txtColor) css += 'color: ' + this.txtColor + ';';
    return css;
  },

  initialsText: function () {
    var user = this.user ? this.user : Meteor.users.findOne(this.userId);
    return this.initials || Avatar.getInitials(user);
  }

});

// Use a reactive variable to store image load success/failure
Template.avatar.created = function () {
  var self = this;

  this.hasImage = new ReactiveVar();

  this.autorun(function () {
    var data = Template.currentData();
    var user = data.user ? Template.currentData().user : Meteor.users.findOne(data.userId);
    var image = true;
    if (getService(user) === "none" && Avatar.options.fallbackType === "initials")
      image = false;

    self.hasImage.set(image);
  });
};

// Determine if image loaded successfully and set hasImage variable
Template.avatar.rendered = function () {
  var self = this;
  this.$('img').on('error', function () { self.hasImage.set(false); })
               .on('load',  function () { self.hasImage.set(true); });
};
