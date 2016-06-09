/* globals colWidth, formatText, splitLines */

(function(exports) {
  'use strict';

// EXPERIENCE CLASS
  function Experience(name, position, location, date, description) {
    this.name = name;
    this.position = position;
    this.location = location;
    this.date = date;
    this.description = description;
  }

  exports.Experience = Experience;

  Experience.prototype.getString = function () {
    var str = '';
    str += formatText('company', this.name);
    str += Array(colWidth - this.name.length - this.location.length).join(' ');
    str += formatText('violet', this.location) + '\n';

    str += formatText('yellow', this.position);
    str += Array(colWidth - this.position.length - this.date.length).join(' ');
    str += formatText('violet', this.date) + '\n';

    str += splitLines(this.description);
    str += '\n';
    return str;
  };
})(this);
