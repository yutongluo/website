/* globals formatText */
/* exported File */

'use strict';

var monthNames = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct',
  'Nov', 'Dec'
];

function File(name, permissions, content, lastModified, user, group, directory) {
  this.name = name;
  this.permissions = permissions;
  this.content = content;
  this.size = content.length;
  this.lastModified = lastModified;
  this.user = user;
  this.group = group;
  this.directory = directory;
}

var dateString = function(date) {
  return monthNames[date.getMonth()] + '  ' +
    date.getDay() + '  ' +
    date.getHours() + ':' +
    date.getMinutes();
};

File.prototype.getString = function (detailed) {
  if (detailed) {
    return this.name + ' ';
  } else {
    return this.permissions + '  ' + this.user + '  ' + this.group + '  ' + this.size + '  '+
    dateString(this.lastModified) + '  ' + this.directory ? formatText('blue', this.name) : this.name;
  }
};
