import * as style from './style'

export class Experience {
  public name: string
  public position: string
  public location: string
  public startDate: string
  public endDate: string
  public summary: string
  public highlights: string[]

  constructor (name: string, position: string, location: string, startDate: string, endDate: string, summary: string, highlights: string[]) {
    this.name = name
    this.position = position
    this.location = location
    this.startDate = startDate
    this.endDate = endDate
    if (this.endDate === undefined) {
      this.endDate = 'present'
    }
    this.summary = summary
    this.highlights = highlights ?? []
  }

  getString (): String {
    let str = ''
    str += style.formatText('company', this.name)

    if (this.location !== undefined) {
      str += ' '.repeat(style.colWidth - this.name.length - this.location.length)
      str += style.formatText('violet', this.location)
    }
    str += '\n'

    str += style.formatText('yellow', this.position)
    const dates = style.formatDate(this.startDate) + '-' + style.formatDate(this.endDate)
    str += ' '.repeat(style.colWidth - this.position.length - dates.length)
    str += style.formatText('violet', dates + '\n')

    if (this.summary !== undefined) {
      str += style.splitLines(this.summary) + '\n'
    }

    this.highlights.forEach(element => {
      str += style.formatBullet(element) + '\n'
    })
    return str
  }
}
