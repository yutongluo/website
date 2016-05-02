/* globals formatText:false */
/* exports Filesystem */

'use strict';
// Determines of a directory has a file.
// Return that file if it does, else return null;
function hasFile(directory, fileName) {
  // directory has to be, well, a directory
  if (!directory.directory) {
    return null;
  }
  for (var i in directory.content) {
    if (directory.content[i].name === fileName) {
      return directory.content[i];
    }
  }
}

function arrLast(arr) {
  return arr[arr.length - 1];
}

function FileSystem() {
  // function File(name, permissions, content, lastModified, user, group, directory)
  var guestHome = new File('guest', 'drwxr-xr-x.', [], new Date(), 'guest', 'guest', true);
  var adminHome = new File('admin', 'drwxr-xr-x.', [], new Date('Feb 16 2016'), 'admin', 'admin', true);
  var homeContent = [guestHome, adminHome];
  var home = new File('home', 'drwxr-xr-x.', homeContent, new Date('Feb 3 2016'), 'root', 'root', true);
  this.root = new File('/', 'drwxr-xr-x.', [home], new Date('July 3 2013'), 'root', '502', true);
  this.pwdStack = [];

  // default $HOME is just /home/guest
  this.pwdStack.push(this.root);
  this.pwdStack.push(home);
  this.pwdStack.push(guestHome);

  // remember previous directory for cd -
  this.prevStack = this.pwdStack.slice();
}

function followDirectory(current, paths) {
  var tmpStack = [], temp;
  for (var i = 0; i < paths.length; i++) {
    if (paths[i] === '') {
      continue;
    }
    temp = hasFile(current, paths[i]);
    if (temp === null || temp === undefined || !temp.directory) {
      return false;
    } else {
      tmpStack.push(temp);
      current = temp;
    }
  }
  return tmpStack;
}

// get a file
function followFile(current, paths) {
  var temp;
  for (var i = 0; i < paths.length; i++) {
    if (paths[i] === '') {
      continue;
    }
    temp = hasFile(current, paths[i]);
    if (temp === null) {
      // no such file or directory
      return false;
    } else {
      current = temp;
    }
  }
  return current;
}


FileSystem.prototype.cd = function (path) {
  if (path === '.') {
    // cd . does nothing
    return true;
  } else if (path === '..') {
    // parent directory
    if (this.pwdStack.length > 1) {
      this.prevStack = this.pwdStack.slice();
      this.pwdStack.pop();
    }
    return true;
  } else if (path === '-' ) {
    // previous directory
    var tmp = this.pwdStack;
    this.pwdStack = this.prevStack;
    this.prevStack = tmp;
    return true;
  } else {
    if (typeof path !== 'string') {
      // weird bug where a string ending with '/' is considered an object
      path = path.toString();
    }
    var paths = path.split('/');

    // current is the current folder we're cding from
    // targetPath is the path, if exists, to the destination from the current folder
    var current, targetPath;

    // Absolute path if path started with '/'
    var absolutePath = paths[0] === '';

    if (absolutePath) {
      current = this.root;
    } else {
      // RELATIVE
      current = arrLast(this.pwdStack);
    }
    targetPath = followDirectory(current, paths);
    if (!targetPath) {
      return false;
    }
    this.prevStack = this.pwdStack.slice();
    if (absolutePath) {
      this.pwdStack = [this.root].concat(targetPath);
    } else {
      this.pwdStack = this.prevStack.concat(targetPath);
    }
    return true;
  }
};

FileSystem.prototype.pwd = function() {
  var path = '';
  for ( var i = 0; i < this.pwdStack.length; i++) {
    path += this.pwdStack[i].name;
    if (i !== this.pwdStack.length - 1 && i !== 0) {
      // need to add a slash except for the root folder and the last folder
      path += '/';
    }
  }
  return path;
};

FileSystem.prototype.ls = function(path, flags) {
  var i, targetFile, ret = '';
  if (!path) {
    targetFile = arrLast(this.pwdStack);
  } else {
    if (typeof path !== 'string') {
      // weird bug where a string ending with '/' is considered an object
      path = path.toString();
    }
    var paths = path.split('/');
    var current;
    if (paths[0] === '') {
      // ABSOLUTE path: our string started with a '/'
      current = this.root;
    } else {
      // RELATIVE
      current = arrLast(this.pwdStack);
    }
    targetFile = followFile(current, paths);
  }

  if (!targetFile) {
    return false;
  } else {
    if (targetFile.directory) {
      // is a directory
      if (!flags) {
        // no flags
        for (i = 0; i < targetFile.content.length; i++) {
          if (targetFile.content.directory) {
            ret += formatText('cyan', targetFile.content[i].name);
          } else {
            ret += targetFile.content[i].name;
          }
          ret += ' ';
        }
      } else {
        if (flags.indexOf('l') !== -1) {
          // detailed mode
          // padding for formatting.
          var sizePadding = 0, userPadding = 0, groupPadding = 0;
          var file;

          for (i = 0; i < targetFile.content.length; i++) {
            file = targetFile.content[i];
            if (file.size.toString().length > sizePadding) {
              sizePadding = file.size.toString().length;
            }
            if (file.user.length > userPadding) {
              userPadding = file.user.length;
            }
            if (file.group.length > groupPadding) {
              groupPadding = file.group.length;
            }
          }

          for (i = 0; i < targetFile.content.length; i++) {
            file = targetFile.content[i];
            ret += file.permissions;
            ret += '  ';
            ret += file.user + Array(userPadding - file.user.length + 1).join(' ');
            ret += '  ';
            ret += file.group + Array(groupPadding - file.group.length + 1).join(' ');
            ret += '  ';
            ret += Array(sizePadding - file.size.toString().length).join(' ') + file.size;
            ret += '  ';
            ret += file.lastModified.toDateString();
            ret += '  ';
            if (file.directory) {
              ret += formatText('cyan', targetFile.content[i].name);
            } else {
              ret += targetFile.content[i].name;
            }
            ret += '\n';
          }
        }
      }
    }
    return ret;
  }
};
