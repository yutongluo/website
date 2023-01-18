import { formatText } from './lib/style'
import { ResumeHelper } from './lib/resume-helper'
import { TerminalFile } from './lib/file'
import { FileSystem } from './lib/filesystem'

// hack to get jquery working
import jquery from 'jquery'
import terminal from 'jquery.terminal'
import { SectionCommands, Format, Greetings } from './config'
const $ = terminal(jquery, this)

const resumeHelper = new ResumeHelper()
const promptTimeFormatOptions = { hour12: false }

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

$(document).ready(function () {
  const defaultCommands: any = {
    help: function () {
      this.echo(formatText('bold', 'Terminal Resum&eacute;'))
      this.echo('Available commands:')
      SectionCommands.forEach(command => {
        this.echo('  ' + formatText('bold', command.name) + ': ' + command.helpText)
      })
      this.echo('  ' + formatText('bold', 'help') + ': this help screen')
      // about should always be last
      this.echo('  ' + formatText('bold', 'about') + ': about this site\n')
      this.echo('Common file system commands are also implemented for fun! Run "cat README" for details. ')
    },
    about: function () {
      this.echo('This website is made with terminal-resume.\n')
    }
  }

  const sectionCommands: any = {}
  // dynamically populate sectionCommands from config
  SectionCommands.forEach(command => {
    sectionCommands[command.name] = function () {
      let str = ''
      command.sections.forEach(section => {
        const content = resumeHelper.getSection(section)
        if (content.trimEnd() !== '') {
          str += Format.SectionStart
          str += content
          str += Format.SectionEnd
        }
      })
      this.echo(str)
    }
  })

  const customCommands: any = {
    // insert your custom commands here
    // see https://github.com/jcubic/jquery.terminal/wiki/Getting-Started#creating-the-interpreter
    // for examples on how to use jquery-terminal
    // terminal-resume uses the object intepreter
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
          flags += (arguments[i] as string).substring(1)
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

  }

  $('#term').terminal(
    { ...defaultCommands, ...sectionCommands, ...customCommands },
    {
      greetings: Greetings +
      'Welcome to Terminal Resum&eacute;! Type ' +
      formatText('green', 'help') + ' to start.\n',
      prompt: function (p: (arg0: string) => void) {
        const time = new Date().toLocaleTimeString([], promptTimeFormatOptions)
        let path = fs.pwd()
        if (fs.pwd() === '/home/guest') {
          path = '~'
        }
        p(`➜ ${time} guest@yutongluo:${path}$ `)
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
