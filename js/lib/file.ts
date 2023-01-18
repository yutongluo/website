import { formatText } from './style'

export class TerminalFile {
  public name: string
  public permissions: string
  public content: string | TerminalFile[]
  public fileSize: number
  public lastModified: Date
  public user: string
  public group: string
  public isDirectory: boolean

  constructor (name: string, permissions: string, content: string | TerminalFile[], lastModified: Date, user: string, group: string, isDirectory: boolean) {
    this.name = name
    this.permissions = permissions
    this.content = content
    this.fileSize = content.length
    this.lastModified = lastModified
    this.user = user
    this.group = group
    this.isDirectory = isDirectory
  }

  /**
     * Helper function for ls -l which prints a file in detailed format
     * Padding is require to make ls -l look gloriously aligned
     * @param sizePadding padding for the size field
     * @param userPadding padding for the user field
     * @param groupPadding padding for the group
     * @returns {string}
     */
  printDetailedFile (sizePadding: number, userPadding: number, groupPadding: number): string {
    let ret = ''
    ret += this.permissions
    ret += '  '
    ret += this.user + ' '.repeat(userPadding - this.user.length + 1)
    ret += '  '
    ret += this.group + ' '.repeat(groupPadding - this.group.length + 1)
    ret += '  '
    ret += `${' '.repeat(sizePadding - this.fileSize.toString().length)}${this.fileSize}`
    ret += '  '
    ret += this.lastModified.toDateString()
    ret += '  '
    if (this.isDirectory) {
      ret += formatText('cyan', this.name)
    } else {
      ret += this.name
    }
    ret += '\n'
    return ret
  }
}
