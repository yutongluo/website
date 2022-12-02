import { TerminalFile } from './file'
import { formatText } from './style'

export class FileSystem {
  public pwdStack: TerminalFile[]
  public root: TerminalFile
  public user: any // TODO make user a class
  private prevStack: TerminalFile[]

  constructor (pwdStack: TerminalFile[], root: TerminalFile, user: any) {
    this.pwdStack = pwdStack
    this.root = root
    this.user = user

    // remember previous directory for cd -
    this.prevStack = this.pwdStack.slice()
  }

  /**
     * Determines if the current user has read permission to a certain file
     * @param file
     * @returns {boolean} true for can read, false for permission denied
     */
  hasReadPermission (file: TerminalFile): boolean {
    // [d][usr][grp][all]
    // 0   123  456  789
    // d   rwx  rwx  rwx
    let readIndex = 7 // 7 is the all read
    if (file.user === this.user.name) {
      // user read
      readIndex = 1
    } else if (file.group === this.user.group) {
      // group read
      readIndex = 4
    }
    return file.permissions[readIndex] === 'r'
  }

  cd (path: string): boolean {
    if (path === '.') {
      // cd . does nothing
      return true
    } else if (path === '..') {
      // parent directory
      if (this.pwdStack.length > 1) {
        this.prevStack = this.pwdStack.slice()
        this.pwdStack.pop()
      }
      return true
    } else if (path === '-') {
      // previous directory
      const tmp = this.pwdStack
      this.pwdStack = this.prevStack
      this.prevStack = tmp
      return true
    } else {
      const newStack = followPath(this.pwdStack.slice(), path, function (a) {
        return a.isDirectory
      })
      if (newStack === undefined) {
        return false
      }
      this.prevStack = this.pwdStack.slice()
      this.pwdStack = newStack

      return true
    }
  }

  pwd (): string {
    let path = ''
    for (let i = 0; i < this.pwdStack.length; i++) {
      path += this.pwdStack[i].name
      if (i !== this.pwdStack.length - 1 && i !== 0) {
        // need to add a slash except for the root folder and the last folder
        path += '/'
      }
    }
    return path
  }

  cat (path: string): string {
    const newStack = followPath(this.pwdStack.slice(), path, function (file: TerminalFile) {
      // follow path as long as it's not a directory
      return !file.isDirectory
    })
    if (newStack === undefined) {
      throw new Error('cat: ' + path + ': no such file!')
    } else {
      const targetFile = arrLast(newStack)
      if (!this.hasReadPermission(targetFile)) {
        throw new Error('cat: ' + path + ': Permission denied')
      }
      return targetFile.content
    }
  }

  ls (path: string, flags: string): string | undefined {
    let i: number
    let targetFile: TerminalFile
    let ret: string = ''

    if (path === undefined || path.length === 0) {
      targetFile = arrLast(this.pwdStack)
    } else {
      const targetPath = followPath(this.pwdStack.slice(), path)
      if (targetPath === undefined) {
        return undefined
      }
      targetFile = arrLast(targetPath)
    }

    let fileContent = [...targetFile.content]

    if (targetFile.isDirectory) {
      fileContent = lsSort(fileContent as TerminalFile[], flags)
    }

    // DETAIL
    if (flags.includes('l')) {
      if (targetFile.isDirectory) {
        const files = fileContent as TerminalFile[]
        // determine padding for formatting
        let sizePadding = 0; let userPadding = 0; let groupPadding = 0
        for (i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.fileSize.toString().length > sizePadding) {
            sizePadding = file.fileSize.toString().length
          }
          if (file.user.length > userPadding) {
            userPadding = file.user.length
          }
          if (file.group.length > groupPadding) {
            groupPadding = file.group.length
          }
        }

        // print the files given the padding
        for (i = 0; i < files.length; i++) {
          ret += files[i].printDetailedFile(sizePadding, userPadding, groupPadding)
        }
      } else {
        // ls -l of a single file
        ret += targetFile.printDetailedFile(
          targetFile.fileSize.toString().length,
          targetFile.user.length,
          targetFile.group.length)
      }
    } else {
      // not detailed
      if (targetFile.isDirectory) {
        const files = fileContent as TerminalFile[]
        for (i = 0; i < files.length; i++) {
          if (files[i].isDirectory) {
            ret += formatText('cyan', files[i].name)
          } else {
            ret += files[i].name
          }
          ret += ' '
        }
      } else {
        ret += targetFile.name
      }
    }
    return ret
  }
}

/**
 * Determines of a directory has a file.
 * @param directory directory to search
 * @param fileName fileName to look for
 * @returns {*} Return that file if file exists in directory, else return false;
 */
function hasFile (directory: TerminalFile, fileName: string): TerminalFile | undefined {
  // directory has to be, well, a directory
  if (!directory.isDirectory) {
    return undefined
  }
  const content = directory.content as TerminalFile[]
  for (let i = 0; i < content.length; i++) {
    if (content[i].name === fileName) {
      return content[i]
    }
  }
  return undefined
}

function arrLast (arr: any[]): any {
  return arr[arr.length - 1]
}

/**
 * Follows a path given current pwd and path.
 * @param {TerminalFile[]} stack current stack from which the path extends
 * @param {String} path path to target
 * @param {function} [isValid] (file) -> boolean
 * @returns {*} false if the target Path does not exist, or
 *              a pwdstack if the target Path exists and isValid is true for the target file.
 */
function followPath (stack: TerminalFile[], path: string, isValid?: (a: TerminalFile) => boolean): TerminalFile[] | undefined {
  let temp

  const paths = path.split('/')

  // Absolute path if path started with '/'
  const absolutePath = paths[0] === ''
  if (absolutePath) {
    // stack[0] should always be the root directory.
    // if absolute path, stack should start at the root directory.
    stack = [stack[0]]
  }

  for (let i = 0; i < paths.length; i++) {
    if (paths[i] === '' || paths[i] === '.') {
      continue
    }
    if (paths[i] === '..') {
      // go one previous directory
      if (stack.length > 1) {
        stack.pop()
      }
      continue
    }
    temp = hasFile(arrLast(stack), paths[i])
    if (temp === undefined) {
      return undefined
    } else {
      stack.push(temp)
    }
  }
  if (typeof isValid !== 'undefined') {
    if (isValid(arrLast(stack))) {
      return stack
    } else {
      return undefined
    }
  }
  return stack
}

/**
 * Helper function for sorting in ls. sorts alphanumerically by default
 * @param files files to sort
 * @param flags ls flags such as -t (timestamp) -S (size) and -r (reverse)
 * @returns {*}
 */
function lsSort (files: TerminalFile[], flags: string): TerminalFile[] {
  const fileList = files.slice()

  // default sort is alphanumeric
  let sortFunction = function (a: TerminalFile, b: TerminalFile): number {
    if (a.name === b.name) {
      return 0
    } else if (a.name < b.name) {
      return -1
    } else {
      return 1
    }
  }

  if (flags.includes('t')) {
    // sort by time
    sortFunction = function (a, b) {
      return a.lastModified.getUTCMilliseconds() - b.lastModified.getUTCMilliseconds()
    }
  } else if (flags.includes('S')) {
    // sort by size
    sortFunction = function (a, b) {
      return a.fileSize - b.fileSize
    }
  }
  // sort!
  fileList.sort(sortFunction)
  if (flags.includes('r')) {
    fileList.reverse()
  }
  return fileList
}
