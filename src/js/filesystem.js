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

function FileSystem() {
  // function File(name, permissions, content, lastModified, user, group, directory)
  var README = new File('README', '-rwxr-xr-x.', 'Welcome!', new Date('May 2 2016'), 'guest', 'guest', false);

  var guestHome = new File('guest', 'drwxr-xr-x.', [README], new Date(), 'guest', 'guest', true);
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
 * @returns {*} false if the target Path does not exist, or the target file path points to returns false for isValid
 *              A pwdstack if the target Path exists, and isValid is true for the target file.
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
    return !file.directory;
  });
  if (newStack === false) {
    return false;
  } else {
    var targetFile = arrLast(newStack);
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
    if (!flags) {
      // no flags
      if (targetFile.directory) {
        for (i = 0; i < targetFile.content.length; i++) {
          if (targetFile.content.directory) {
            ret += formatText('cyan', targetFile.content[i].name);
          } else {
            ret += targetFile.content[i].name;
          }
          ret += ' ';
        }
      }
      else {
        ret += targetFile.name;
      }
    } else {
      if (flags.indexOf('l') !== -1) {
        if (targetFile.directory) {

          // determine padding for formatting
          var sizePadding = 0, userPadding = 0, groupPadding = 0;
          for (i = 0; i < targetFile.content.length; i++) {
            var file = targetFile.content[i];
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
          for (i = 0; i < targetFile.content.length; i++) {
            ret += printDetailedFile(targetFile.content[i], sizePadding, userPadding, groupPadding);
          }
        } else {
          ret += printDetailedFile(
            targetFile,
            targetFile.filesize.toString().length,
            targetFile.user.length,
            targetFile.group.length);
        }

      }
    }
    return ret;
  }
};
