/* globals formatText:false */
/* exports Filesystem */

'use strict';
/**
 * Determines of a directory has a file.
 * @param directory directory to search
 * @param fileName fileName to look for
 * @returns {*} Return that file if file exists in directory, else return false;
 */
function hasFile(directory, fileName) {
  // directory has to be, well, a directory
  if (!directory.directory) {
    return false;
  }
  for (var i = 0; i < directory.content.length; i++) {
    if (directory.content[i].name === fileName) {
      return directory.content[i];
    }
  }
  return false;
}

function arrLast(arr) {
  return arr[arr.length - 1];
}

function FileSystem(pwdStack, root, user) {

  this.pwdStack = pwdStack;
  this.root = root;
  this.user = user;

  // remember previous directory for cd -
  this.prevStack = this.pwdStack.slice();
}

/**
 * Determines if the current user has read permission to a certain file
 * @param file
 * @returns {boolean} true for can read, false for permission denied
 */
FileSystem.prototype.hasReadPermission = function (file) {
  // [d][usr][grp][all]
  // 0   123  456  789
  // d   rwx  rwx  rwx
  var readIndex = 7; // 7 is the all read
  if (file.user === this.user.name) {
    // user read
    readIndex = 1;
  }
  if (file.group === this.user.group) {
    // group read
    readIndex = 4;
  }
  return file.permissions[readIndex] === 'r';
};

function printDetailedFile(file, sizePadding, userPadding, groupPadding) {
  var ret = "";
  ret += file.permissions;
  ret += '  ';
  ret += file.user + Array(userPadding - file.user.length + 1).join(' ');
  ret += '  ';
  ret += file.group + Array(groupPadding - file.group.length + 1).join(' ');
  ret += '  ';
  ret += Array(sizePadding - file.filesize.toString().length).join(' ') + file.filesize;
  ret += '  ';
  ret += file.lastModified.toDateString();
  ret += '  ';
  if (file.directory) {
    ret += formatText('cyan', file.name);
  } else {
    ret += file.name;
  }
  ret += '\n';
  return ret;
}

/**
 * Follows a path given current pwd and path.
 * @param {File[]} stack current stack from which the path extends
 * @param {String} path path to target
 * @param {function} [isValid] (file) -> boolean
 * @returns {*} false if the target Path does not exist, or
 *              a pwdstack if the target Path exists and isValid is true for the target file.
 */
function followPath(stack, path, isValid) {
  var temp;

  if (typeof path !== 'string') {
    // fixes weird bug where a string ending with '/' is considered an object
    path = path.toString();
  }

  path = path.split('/');

  // Absolute path if path started with '/'
  var absolutePath = path[0] === '';
  if (absolutePath) {
    // stack[0] should always be the root directory.
    // if absolute path, stack should start at the root directory.
    stack = [stack[0]];
  }

  for (var i = 0; i < path.length; i++) {
    if (path[i] === '' || path[i] === '.') {
      continue;
    }
    if (path[i] === '..') {
      // go one previous directory
      if (stack.length > 1) {
        stack.pop();
      }
      continue;
    }
    temp = hasFile(arrLast(stack), path[i]);
    if (temp === false) {
      return false;
    } else {
      stack.push(temp);
    }
  }
  if (isValid) {
    if (isValid(arrLast(stack))) {
      return stack;
    } else {
      return false;
    }
  }
  return stack;
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
  } else if (path === '-') {
    // previous directory
    var tmp = this.pwdStack;
    this.pwdStack = this.prevStack;
    this.prevStack = tmp;
    return true;
  } else {
    var newStack = followPath(this.pwdStack.slice(), path, function (a) {
      return a.directory;
    });
    if (!newStack) {
      return false;
    }
    this.prevStack = this.pwdStack.slice();
    this.pwdStack = newStack;

    return true;
  }
};

FileSystem.prototype.pwd = function () {
  var path = '';
  for (var i = 0; i < this.pwdStack.length; i++) {
    path += this.pwdStack[i].name;
    if (i !== this.pwdStack.length - 1 && i !== 0) {
      // need to add a slash except for the root folder and the last folder
      path += '/';
    }
  }
  return path;
};

FileSystem.prototype.cat = function (path) {
  var newStack = followPath(this.pwdStack.slice(), path, function (file) {
    // follow path as long as it's not a directory
    return !file.directory;
  });
  if (newStack === false) {
    throw new Error('cat: ' + path + ': no such file!');
  } else {
    var targetFile = arrLast(newStack);
    if (!this.hasReadPermission(targetFile)) {
      throw new Error('cat: ' + path + ': Permission denied');
    }
    return targetFile.content;
  }
};

FileSystem.prototype.ls = function (path, flags) {
  var i, targetFile, ret = '';
  if (!path) {
    targetFile = arrLast(this.pwdStack);
  } else {
    targetFile = arrLast(followPath(this.pwdStack.slice(), path));
  }

  if (!targetFile) {
    return false;
  } else {
    var fileList = targetFile.content.slice();

    // SORTING
    if (targetFile.directory) {
      // sorting only matters on directories
      // (since ls on non-directory file returns only that file)

      var sortFunction = function (a, b) {
        return a.name > b.name;
      };

      if (flags.indexOf('t') !== -1) {
        // sort by time
        sortFunction = function (a, b) {
          return a.lastModified < b.lastModified;
        };
      } else if (flags.indexOf('S') !== -1) {
        sortFunction = function (a, b) {
          return a.filesize < b.filesize;
        };
      }
      // sort!
      fileList.sort(sortFunction);
      if (flags.indexOf('r') >= 0) {
        fileList.reverse();
      }
    }

    // DETAIL
    if (flags.indexOf('l') !== -1) {
      if (targetFile.directory) {

        // determine padding for formatting
        var sizePadding = 0, userPadding = 0, groupPadding = 0;
        for (i = 0; i < fileList.length; i++) {
          var file = fileList[i];
          if (file.filesize.toString().length > sizePadding) {
            sizePadding = file.filesize.toString().length;
          }
          if (file.user.length > userPadding) {
            userPadding = file.user.length;
          }
          if (file.group.length > groupPadding) {
            groupPadding = file.group.length;
          }
        }

        // print the files given the padding
        for (i = 0; i < fileList.length; i++) {
          ret += printDetailedFile(fileList[i], sizePadding, userPadding, groupPadding);
        }
      } else {
        ret += printDetailedFile(
          targetFile,
          targetFile.filesize.toString().length,
          targetFile.user.length,
          targetFile.group.length);
      }
    } else {
      // not detailed
      if (targetFile.directory) {
        for (i = 0; i < fileList.length; i++) {
          if (fileList[i].directory) {
            ret += formatText('cyan', fileList[i].name);
          } else {
            ret += fileList[i].name;
          }
          ret += ' ';
        }
      }
      else {
        ret += targetFile.name;
      }
    }
    return ret;
  }
};
