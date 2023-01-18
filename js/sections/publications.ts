import { Format } from '../config'
import { formatDate, formatText, splitLines } from '../lib/style'
import type { ISection } from './section.interface'

interface JsonPublication {
  name: string
  publisher: string | undefined
  releaseDate: string | undefined
  url: string | undefined
  summary: string | undefined
}

export class Publication implements ISection {
  private readonly publication: JsonPublication

  constructor (publication: JsonPublication) {
    this.publication = publication
  }

  public toString = (): string => {
    let str = ''
    str += formatText('bold', this.publication.name)

    if (this.publication.releaseDate !== undefined) {
      const date = formatDate(new Date(this.publication.releaseDate))
      str += ' '.repeat(Format.CharsPerLine - this.publication.name.length - date.length)
      str += formatText('date', date)
    }
    str += '\n'

    if (this.publication.publisher !== undefined) {
      str += formatText('description', this.publication.publisher) + '\n'
    }

    if (this.publication.url !== undefined) {
      str += formatText('url', this.publication.url) + '\n'
    }

    if (this.publication.summary !== undefined) {
      str += splitLines(this.publication.summary) + '\n'
    }
    return str
  }
}
