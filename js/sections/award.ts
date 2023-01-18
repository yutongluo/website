import { Format } from '../config'
import { formatDate, formatText, splitLines } from '../lib/style'
import type { IArraySection } from './array-section.interface'

interface JsonAward {
  title: string
  date: string | undefined
  awarder: string
  summary: string
}

export class Award implements IArraySection {
  addLineBreaks = true
  private readonly award: JsonAward

  constructor (award: JsonAward) {
    this.award = award
  }

  public toString = (): string => {
    let str = ''
    str += formatText('company', this.award.title)

    if (this.award.date !== undefined) {
      const date = formatDate(new Date(this.award.date))
      str += ' '.repeat(Format.CharsPerLine - this.award.title.length - date.length)
      str += formatText('date', date)
    }
    str += '\n'
    str += formatText('bold', this.award.awarder) + '\n'
    str += splitLines(this.award.summary) + '\n'
    return str
  }
}
