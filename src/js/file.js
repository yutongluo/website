/* globals formatText */
/* exported File */

'use strict';

function File(name, permissions, content, lastModified, user, group, isDirectory) {
  this.name = name;
  this.permissions = permissions;
  this.content = content;
  this.filesize = content.length;
  this.lastModified = lastModified;
  this.user = user;
  this.group = group;
  this.isDirectory = isDirectory;
}


/**
 * Helper function for ls -l which prints a file in detailed format
 * Padding is require to make ls -l look gloriously aligned
 * @param sizePadding padding for the size field
 * @param userPadding padding for the user field
 * @param groupPadding padding for the group
 * @returns {string}
 */
File.prototype.printDetailedFile = function (sizePadding, userPadding, groupPadding) {
  var ret = "";
  ret += this.permissions;
  ret += '  ';
  ret += this.user + Array(userPadding - this.user.length + 1).join(' ');
  ret += '  ';
  ret += this.group + Array(groupPadding - this.group.length + 1).join(' ');
  ret += '  ';
  ret += Array(sizePadding - this.filesize.toString().length).join(' ') + this.filesize;
  ret += '  ';
  ret += this.lastModified.toDateString();
  ret += '  ';
  if (this.isDirectory) {
    ret += formatText('cyan', this.name);
  } else {
    ret += this.name;
  }
  ret += '\n';
  return ret;
};

