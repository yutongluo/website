import { FileSystem } from './filesystem'
import { TerminalFile } from './file'
import { formatText, splitLines } from './style'
import { Experience } from './experience'
import resume from './content/resume.json'

// hack to get jquery working
import jquery from 'jquery'
import terminal from 'jquery.terminal'
const $ = terminal(jquery, this)

// HELPER FUNCTIONS AND DEFINITIONS
const getAge = function (): number {
  const today = new Date()
  const bday = new Date()
  bday.setFullYear(1993)
  bday.setMonth(4)
  const difference = today.getTime() - bday.getTime()
  const ageDate = new Date(difference)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const initFS = function (): FileSystem {
  // function TerminalFile(name, permissions, content, lastModified, user, group, isDirectory)
  const readmeContent = 'Welcome! \n' +
    'Common commands such as ls, cd, cat, pwd works. ls accepts flags such as -a, -t, -l, -S. \n' +
    'cat respects file permissions. \n' +
    'These commands are implemented in typescript for fun.'

  const README = new TerminalFile('README', '-rw-r--r--.', readmeContent, new Date('May 2 2016'), 'guest', 'guest', false)

  const cakeIsALie = new TerminalFile('?', '-rw-rw----.', 'the cake is a lie', new Date('June 9 2016'), 'admin', 'admin', false)

  const guestHome = new TerminalFile('guest', 'drwxr-xr-x.', [README], new Date(), 'guest', 'guest', true)
  const adminHome = new TerminalFile('admin', 'drwxr-xr-x.', [cakeIsALie], new Date('Feb 16 2016'), 'admin', 'admin', true)
  const homeContent = [guestHome, adminHome]
  const home = new TerminalFile('home', 'drwxr-xr-x.', homeContent, new Date('Feb 3 2016'), 'root', 'root', true)
  const root = new TerminalFile('/', 'drwxr-xr-x.', [home], new Date('July 3 2013'), 'root', '502', true)
  const pwdStack = []

  // default $HOME is just /home/guest
  pwdStack.push(root)
  pwdStack.push(home)
  pwdStack.push(guestHome)

  return new FileSystem(pwdStack, root, { name: 'guest', group: 'guest' })
}

const fs = initFS()

// READY SET LAUNCH
$(document).ready(function () {
  $('#term').terminal(
    {
      version: '0.1',
      help: function () {
        this.echo(formatText('bold', 'Command Line Resum&eacute;'))
        this.echo('Available commands:')
        this.echo('  ' + formatText('bold', 'whoami') + '        get to know Yutong')
        this.echo('  ' + formatText('bold', 'experience') + '    what has yutong done?')
        this.echo('  ' + formatText('bold', 'projects') + '      Yutong\'s proudest moments')
        this.echo('  ' + formatText('bold', 'help  ') + '        this help screen')

        // about should always be last
        this.echo('  ' + formatText('bold', 'about') + '         about this site\n\n')
      },
      whoami: function () {
        this.echo(formatText('heading', 'Basic info:'))
        this.echo(formatText('bold', 'Subject Name: ') + 'Yutong Luo')
        this.echo(formatText('bold', 'Subject Role: ') + 'Software Developer')
        this.echo(formatText('bold', 'Subject Age: ') + getAge().toString())
        this.echo(formatText('bold', 'Subject Education: ') + 'University of Waterloo (Graduated in 2016)')
        this.echo(formatText('bold', 'Known Locations: ') + 'Seattle, Toronto, Markham')
        this.echo('\n')
        this.echo(formatText('heading', 'Bio:'))
        this.echo(splitLines(
          'Little is known about our bespectacled subject, besides his ability to code. ' +
          'Through rigorous training in the famed co-op program at University of Waterloo, ' +
          'he has interned at companies big and small. Through this process, he transformed ' +
          'from a novice who gets code to work to a man with an obsession for writing the perfect' +
          ' code. Now on a quest for an unobtainable goal, he is determined to be the best.'))
        this.echo('\n')
        this.echo(formatText('heading', 'Skills:'))
        this.echo(formatText('skill', 'Big Data'))
        this.echo('Spark, SparkSQL, Hadoop, Hive\n')
        this.echo(formatText('skill', 'Web Development'))
        this.echo('Django, Play, HTML5, CSS, Javascript, Backbone.js, RESTful API, Node.js\n')
        this.echo(formatText('skill', 'Mobile Development'))
        this.echo('Android, Parse, Swift\n')
        this.echo(formatText('skill', 'Languages'))
        this.echo('C++, Python, C, Java 8, JavaScript, jQuery, HTML, CSS, Bash, Swift\n')
      },
      experience: function () {
        // EXPERIENCES

        const experiences = resume.work.map(exp =>
          new Experience(
            exp.name,
            exp.position,
            exp.location,
            exp.startDate,
            exp.endDate,
            exp.summary,
            exp.highlights
          ))
        for (let i = 0; i < experiences.length; i++) {
          this.echo(experiences[i].getString())
        }
      },
      about: function () {
        this.echo('This site is made with jquery.terminal.')
        this.echo('Copyright &copy; Yutong Luo ' + new Date().getFullYear().toString() + '\n')
      },
      projects: function () {
        this.echo(formatText('heading', 'Hackathons'))
        this.echo(formatText('company', 'Hack the North') + ': ' + formatText('violet', 'Bloomberg API Prize'))
        this.echo(formatText('yellow', 'Stockslate: A webapp which ranks stocks based on investor profiles\n'))
        this.echo(splitLines(
          'Implemented back-end to pull data from Bloomberg API into MongoDB in realtime with Node.js\n'))
        this.echo(formatText('company', 'IBM FutureBlue Hackathon') + ': ' + formatText('violet', 'First Place'))
        this.echo(formatText('yellow', 'A web app which hosts car pooling for IBM employees\n'))
        this.echo(splitLines(
          'Designed and implemented user interactions and dynamic HTML generation with JavaScript and jQuery\n'
        ))
        this.echo(formatText('company', 'Groupon Geekon') + ': ' + formatText('violet', 'No prize but had fun'))
        this.echo(formatText('yellow', 'A large scale system within Groupon which aggregates multiple services together'))
        this.echo(splitLines('Implemented back-end API using Dropwizard in Java\n'))

        this.echo(formatText('heading', 'Projects'))
        this.echo(formatText('company', 'Toronto 311 Map'))
        this.echo('Using google map API, plot out all the potholes in Toronto\n')
        this.echo(formatText('company', 'Timecatcher'))
        this.echo('A smart calendar Android app which schedules a user\'s day using AI algorithms\n')
      },
      pwd: function () {
        this.echo(fs.pwd())
      },
      cd: function (path: string) {
        if (path === undefined || path.length === 0) {
          fs.cd('/home/guest')
        } else if (!fs.cd(path)) {
          this.error('No such directory!')
        }
      },
      ls: function () {
        let flags = ''
        let path = ''
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i][0] === '-') {
            flags += arguments[i].substring(1)
          } else {
            path = arguments[i]
          }
        }
        const lsResult = fs.ls(path, flags)
        if (lsResult === undefined) {
          this.error('No such file or directory!')
        } else {
          this.echo(lsResult)
        }
      },
      cat: function (path: string) {
        try {
          const catResult = fs.cat(path)
          this.echo(catResult)
        } catch (error: any) {
          this.error(error.message)
        }
      }
    },
    {
      greetings: '[[g;#fdf6e3;]__     __    _                      _\n' +
    '\\ \\   / /   | |                    | |\n' +
    ' \\ \\_/ /   _| |_ ___  _ __   __ _  | |    _   _  ___\n' +
    '  \\   / | | | __/ _ \\| \'_ \\ / _` | | |   | | | |/ _ \\\n' +
    '   | || |_| | || (_) | | | | (_| | | |___| |_| | (_) |\n' +
    '   |_| \\__,_|\\__\\___/|_| |_|\\__, | |______\\__,_|\\___/\n' +
    '                             __/ |                    \n' +
    '                            |___/ \n\n]' +
    'Welcome to Command Line Resum&eacute;. Type ' +
    formatText('green', 'help') + ' to start.\n',
      prompt: function (p: (arg0: string) => void) {
        let path = fs.pwd()
        if (fs.pwd() === '/home/guest') {
          path = '~'
        }
        p('guest@yutongluo:' + path + '$ ')
      },
      onBlur: function () {
      // prevent losing focus
        return false
      },
      checkArity: false,
      completion: true,
      history: true
    })
})
