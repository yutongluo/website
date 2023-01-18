import { Format } from '../config'
import { formatDate, formatText, splitLines } from '../lib/style'
import type { ISection } from './section.interface'

interface JsonAward {
  title: string
  date: string | undefined
  awarder: string
  summary: string
}

export class Award implements ISection {
  private readonly award: JsonAward

  constructor (award: JsonAward) {
    this.award = award
  }

  public toString = (): string => {
    let str = ''
    str += formatText('bold', this.award.title)

    if (this.award.date !== undefined) {
      const date = formatDate(new Date(this.award.date))
      str += ' '.repeat(Format.CharsPerLine - this.award.title.length - date.length)
      str += formatText('date', date)
    }
    str += '\n'
    str += formatText('description', this.award.awarder) + '\n'
    str += splitLines(this.award.summary) + '\n'
    return str
  }
}
