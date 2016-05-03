/* globals $, Experience, formatText, splitLines, document, FileSystem */
'use strict';

// HELPER FUNCTIONS AND DEFINITIONS
var getAge = function() {
  var today = new Date();
  var bday = new Date();
  bday.setYear(1993);
  bday.setMonth(4);
  var difference = today - bday.getTime();
  var ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

var fs = new FileSystem();

// EXPERIENCES
var experiences = [
  new Experience(
    'Groupon',
    'Computational Marketing Intern',
    'Seattle, WA',
    'May 2015–Aug 2015',
    'Evaluated Spark and SparkSQL as replacement for existing Hadoop Implementation. Saw 5-10x performance increase,' +
    ' proposed migration plan and identified key blockers and potential solutions. ' +
    'Implemented metrics, API, and testing framework for low-latency microservice with Play API and Cassandra. ' +
    'The full-times were busy with the existing system, so I got to do all the glorious coding!'
  ),
  new Experience(
    'Top Hat',
    'Full-stack Developer Intern',
    'Toronto, ON',
    'Sept 2014–Dec 2014',
    'Fixed and wrote unit tests for ~40 bugs including XSS vulnerabilities, 2D distance calculations, and Excel ' +
    'export errors, totaling a weighted value of $192,840. Chasing bugs across stacks was actually kind of fun. ' +
    ' Led web accessibility project with a team of 2 making ' +
    'web interfaces ADA compliant. Feedback from stakeholder: \"There\'s a lot of work to be done, but overall ' +
    'good work!\"'
  ),
  new Experience(
    'IBM',
    'Compiler Optimization Intern',
    'Markham, ON',
    'Jan 2014–Apr 2014',
    'Created Node.js application that aggregated node-load output and plotted the data using d3.js. ' +
    'Refactored C++ compiler codebase to support JIT compilation for different languages. Humbling experience to ' +
    'appreciate how much work goes into making and optimizing a compiler.'
  ),
  new Experience(
    'Maxxian',
    'Software Developer Intern',
    'Markham, ON',
    'May 2013–Aug 2013',
    'Developed MVC prototype replacement of current product with Django. Improved page load time by over 60 times ' +
    'implemented RESTful API which returns data from Postgres in JSON format. Significantly improved excel report ' +
    'generation times by caching and reusing data. First time working at a start up. Learned all my linux basics here,' +
    ' from setting up physical servers, to managing VMs with hypervisors, all the way to writing, installing and testing ' +
    'the software. '
  ),
  new Experience(
    'BMO InvestorLine',
    'E-Business Specialist',
    'Toronto, ON',
    'Sept 2012–Dec 2012',
    'Initiated automation effort to significantly improve efficiency of generating HTML tables from Excel documents ' +
    'using VBA. Had a friendly competition with a fellow intern on who will finish it first. He gave up in the end. ' +
    'Developed dynamic PDF forms using JavaScript to enforce correct data entry while providing easier client experience.'
  )
];

// BASH RESUME OBJECT
var BashResume = {
  version: '0.1',
  help: function() {
    this.echo(formatText('bold', 'Command Line Resum&eacute; version ' + BashResume.version +
      '-release (i686-pc-linux-gnu)'));
    this.echo('Available commands:');
    this.echo('  ' + formatText('bold', 'whoami') + '\t\tget to know Yutong');
    this.echo('  ' + formatText('bold', 'experience') + '\twhat has yutong done?');
    this.echo('  ' + formatText('bold', 'projects') + '\t  Yutong\'s proudest moments');
    this.echo('  ' + formatText('bold', 'help  ') + '\t\tthis help screen');

    // about should always be last
    this.echo('  ' + formatText('bold', 'about') + '\t\t about this site\n\n');


    this.echo(
      formatText('magenta', 'Don\'t like the command line? Go to ')  + 'https://gui.yutongluo.com\n');

  },
  whoami: function() {
    this.echo(formatText('heading', 'Basic info:'));
    this.echo(formatText('bold', 'Subject Name: ') + 'Yutong Luo');
    this.echo(formatText('bold', 'Subject Role: ') + 'Software Developer');
    this.echo(formatText('bold', 'Subject Age: ') + getAge());
    this.echo(formatText('bold', 'Subject Education: ') + 'University of Waterloo (Graduate in 2016)');
    this.echo(formatText('bold', 'Known Locations: ') + 'Seattle, Toronto, Markham');
    this.echo('\n');
    this.echo(formatText('heading', 'Bio:'));
    this.echo(splitLines(
      'Little is known about our bespectacled subject, besides his ability to code. ' +
      'Through rigorous training in the famed co-op program at University of Waterloo, ' +
      'he has interned at companies big and small. Through this process, he transformed ' +
      'from a novice who gets code to work to a man with an obsession for writing the perfect' +
      ' code. Now on a quest for an unobtainable goal, he is determined to be the best.'));
    this.echo('\n');
    this.echo(formatText('heading', 'Skills:'));
    this.echo(formatText('skill', 'Big Data'));
    this.echo('Spark, SparkSQL, Hadoop, Hive\n');
    this.echo(formatText('skill', 'Web Development'));
    this.echo('Django, Play, HTML5, CSS, Javascript, Backbone.js, RESTful API, Node.js\n');
    this.echo(formatText('skill', 'Mobile Development'));
    this.echo('Android, Parse, Swift\n');
    this.echo(formatText('skill', 'Languages'));
    this.echo('C++, Python, C, Java 8, JavaScript, jQuery, HTML, CSS, Bash, Swift\n');
  },
  experience: function() {
    for (var i = 0; i < experiences.length; i++) {
      this.echo(experiences[i].getString());
    }
  },
  about: function() {
    this.echo('This site is made with jquery.terminal.');
    this.echo('Copyright &copy; Yutong Luo 2016\n');
  },
  projects: function() {
    this.echo(formatText('heading', 'Hackathons'));
    this.echo(formatText('company', 'Hack the North') + ': ' + formatText('violet', 'Bloomberg API Prize'));
    this.echo(formatText('yellow', 'Stockslate: A webapp which ranks stocks based on investor profiles\n'));
    this.echo(splitLines(
      'Implemented back-end to pull data from Bloomberg API into MongoDB in realtime with Node.js\n'));
    this.echo(formatText('company', 'IBM FutureBlue Hackathon') + ': ' + formatText('violet', 'First Place'));
    this.echo(formatText('yellow', 'A web app which hosts car pooling for IBM employees\n'));
    this.echo(splitLines(
      'Designed and implemented user interactions and dynamic HTML generation with JavaScript and jQuery\n'
      ));
    this.echo(formatText('company', 'Groupon Geekon') + ': ' + formatText('violet', 'No prize but had fun'));
    this.echo(formatText('yellow', 'A large scale system within Groupon which aggregates multiple services together'));
    this.echo(splitLines('Implemented back-end API using Dropwizard in Java\n'));

    this.echo(formatText('heading', 'Projects'));
    this.echo(formatText('company', 'Toronto 311 Map'));
    this.echo('Using google map API, plot out all the potholes in Toronto\n');
    this.echo(formatText('company', 'Timecatcher'));
    this.echo('A smart calendar Android app which schedules a user\'s day using AI algorithms\n');
  },
  pwd: function() {
    this.echo(fs.pwd());
  },
  cd: function(path) {
    if (!path) {
      fs.cd('/home/guest');
    } else if (!fs.cd(path)) {
      this.error('No such directory!');
    }
  },
  ls: function() {
    var flags = '';
    var path = '';
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i][0] === '-') {
        flags += arguments[i].substring(1);
      } else {
        path = arguments[i];
      }
    }
    var lsResult = fs.ls(path, flags);
    if (lsResult === false) {
      this.error('No such file or directory!');
    } else {
      this.echo(lsResult);
    }
  },
  cat: function(path) {
    var catResult = fs.cat(path);
    if (catResult === false) {
      this.error("cat: " + path + ": no such file!");
    } else {
      this.echo(catResult);
    }
  }
};

// READY SET LAUNCH
$(document).ready(function() {
  $('#term').terminal(BashResume, {
    greetings: '[[g;#fdf6e3;]__     __    _                      _\n' +
    '\\ \\   / /   | |                    | |\n' +
    ' \\ \\_/ /   _| |_ ___  _ __   __ _  | |    _   _  ___\n' +
    '  \\   / | | | __/ _ \\| \'_ \\ / _` | | |   | | | |/ _ \\\n' +
    '   | || |_| | || (_) | | | | (_| | | |___| |_| | (_) |\n' +
    '   |_| \\__,_|\\__\\___/|_| |_|\\__, | |______\\__,_|\\___/\n' +
    '                             __/ |                    \n' +
    '                            |___/ \n\n]' +
    'Welcome to Command Line Resum&eacute; v' + BashResume.version + '. Type ' +
    formatText('green', 'help') + ' to start\n',
    prompt: function(p){
      var path = fs.pwd();
      if (fs.pwd() === '/home/guest') {
        path = '~';
      }
      p('guest@yutongluo:' + path + '$ ');
    },
    onBlur: function() {
      // prevent losing focus
      return false;
    },
    checkArity: false,
    completion: true,
    history: true});
});
