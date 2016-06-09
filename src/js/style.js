/* exported formatText, splitLines */

(function (exports) {

  'use strict';

// exported option does not work for some reason

// Styles with solarized color scheme <3
  var styles = {
    'bold': '[[b;#fdf6e3;]',
    'glow': '[[g;#fdf6e3;]',
    'green': '[[;#859900;]',
    'yellow': '[[;#b58900;]',
    'orange': '[[;#cb4b16;]',
    'magenta': '[[;#d33682;]',
    'violet': '[[;#6c71c4;]',
    'blue': '[[;#268bd2;]',
    'cyan': '[[;#2aa198;]',
    'heading': '[[bug;#2aa198;]',
    'company': '[[bg;#268bd2;]',
    'skill': '[[bg;#859900;]'
  };

  var colWidth = 80;

  var formatText = function (format, text) {
    return styles[format] + text + ']';
  };
  exports.formatText = formatText;

  var splitLines = function (str) {
    var words = str.split(' ');
    var col = 0;
    var newColSize = 0;
    var line = '';
    var ret = '';

    for (var i = 0; i < words.length;) {
      newColSize = col + words[i].length + 1;
      if (newColSize > colWidth && line !== '') {
        // new word is not going to fit
        line += '\n';
        col = 0;
        ret += line;
        line = '';
      } else {
        col = newColSize;
        line += words[i++] + ' ';
      }
    }
    // something's left
    if (line !== '') {
      ret += line;
    }

    return ret;
  };
  exports.splitLines = splitLines;


})(this);
