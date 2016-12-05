/* jshint mocha: true */

var assert = require('assert');
var File = require('./../src/js/file.js');
var FileSystem = require('./../src/js/filesystem.js');

function runTests() {

  var A = new File('A', '-rw-r--r--.', 'A', new Date('May 2 2016'), 'guest', 'guest', false);
  var noAccess = new File('B', '-rw-rw----.', 'B', new Date('June 9 2016'), 'admin', 'admin', false);

  var guestHome = new File('guest', 'drwxr-xr-x.', [A], new Date(), 'guest', 'guest', true);
  var adminHome = new File('admin', 'drwxr-xr-x.', [noAccess], new Date('Feb 16 2016'), 'admin', 'admin', true);
  var homeContent = [guestHome, adminHome];
  var home = new File('home', 'drwxr-xr-x.', homeContent, new Date('Feb 3 2016'), 'root', 'root', true);
  var root = new File('/', 'drwxr-xr-x.', [home], new Date('July 3 2013'), 'root', '502', true);
  var pwdStack = [];

  // default $HOME is just /home/guest
  pwdStack.push(root);
  pwdStack.push(home);
  pwdStack.push(guestHome);

  var fs = new FileSystem(pwdStack, root, {'name': 'guest', 'group': 'guest'});

  describe('File system tests', function () {
    it('pwd should give current directory', function () {
      assert(true, fs.pwd() === pwdStack);
    });
  });
}


runTests();
