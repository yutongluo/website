/* globals formatText:false */
/* exports Filesystem */

(function (exports) {
  'use strict';

  function FileSystem(pwdStack, root, user) {

    this.pwdStack = pwdStack;
    this.root = root;
    this.user = user;

    // remember previous directory for cd -
    this.prevStack = this.pwdStack.slice();
  }

  exports.FileSystem = FileSystem;


  /**
   * Determines of a directory has a file.
   * @param directory directory to search
   * @param fileName fileName to look for
   * @returns {*} Return that file if file exists in directory, else return false;
   */
  function hasFile(directory, fileName) {
    // directory has to be, well, a directory
    if (!directory.isDirectory) {
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
    } else if (file.group === this.user.group) {
      // group read
      readIndex = 4;
    }
    return file.permissions[readIndex] === 'r';
  };


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
        return a.isDirectory;
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
      return !file.isDirectory;
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
  /**
   * Helper function for sorting in ls. sorts alphanumerically by default
   * @param files files to sort
   * @param flags ls flags such as -t (timestamp) -S (size) and -r (reverse)
   * @returns {*}
   */
  function lsSort(files, flags) {
    var fileList = files.slice();

    // default sort is alphanumeric
    var sortFunction = function (a, b) {
      return a.name > b.name;
    };

    if (flags.indexOf('t') !== -1) {
      // sort by time
      sortFunction = function (a, b) {
        return a.lastModified < b.lastModified;
      };
    } else if (flags.indexOf('S') !== -1) {
      // sort by size
      sortFunction = function (a, b) {
        return a.filesize < b.filesize;
      };
    }
    // sort!
    fileList.sort(sortFunction);
    if (flags.indexOf('r') >= 0) {
      fileList.reverse();
    }
    return fileList;
  }

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

      fileList = lsSort(fileList, flags);

      // DETAIL
      if (flags.indexOf('l') !== -1) {
        if (targetFile.isDirectory) {
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
            ret += fileList[i].printDetailedFile(sizePadding, userPadding, groupPadding);
          }
        } else {
          // ls -l of a single file
          ret += targetFile.printDetailedFile(
            targetFile.filesize.toString().length,
            targetFile.user.length,
            targetFile.group.length);
        }
      } else {
        // not detailed
        if (targetFile.isDirectory) {
          for (i = 0; i < fileList.length; i++) {
            if (fileList[i].isDirectory) {
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
})(this);
