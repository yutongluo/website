import * as style from '../lib/style'
import { Format } from '../config'
import { hasContent } from '../lib/utils'
import type { ISection } from './section.interface'

type JsonExperience = {
  position: string
  location: string | undefined
  description: string | undefined
  url: string | undefined
  startDate: Date | undefined
  endDate: Date | undefined
  summary: string | undefined
  highlights: string[] | undefined
} & ({ name: string } | { organization: string }) // one of name or organization required

export class Experience implements ISection {
  private readonly experience: JsonExperience

  constructor (experience: JsonExperience) {
    this.experience = experience
  }

  public toString = (): string => {
    let str = ''
    const name = 'name' in this.experience ? this.experience.name : this.experience.organization
    str += style.formatText('company', name)

    if (hasContent(this.experience.location)) {
      // right align location
      const location = this.experience.location as string
      str += ' '.repeat(Format.CharsPerLine - name.length - location.length)
      str += style.formatText('location', location)
    }
    str += '\n'

    if (hasContent(this.experience.description)) {
      str += style.formatText(
        'description',
        style.splitLines(this.experience.description as string)
      ) + '\n'
    }

    str += style.formatText('role', this.experience.position)
    if (this.experience.startDate !== undefined) {
      // right align dates
      const startDate = new Date(this.experience.startDate)
      const endDate = this.experience.endDate === undefined
        ? undefined
        : new Date(this.experience.endDate)
      const dates = style.formatDate(startDate) + '-' + style.formatDate(endDate)
      str += ' '.repeat(Format.CharsPerLine - this.experience.position.length - dates.length)
      str += style.formatText('date', dates)
    }
    str += '\n'

    if (hasContent(this.experience.url)) {
      str += style.splitLines(style.formatText('url', this.experience.url as string)) + '\n'
    }

    if (hasContent(this.experience.summary)) {
      str += style.splitLines(this.experience.summary as string) + '\n'
    }

    if (this.experience.highlights !== undefined) {
      this.experience.highlights.forEach(element => {
        str += style.formatBullet(element) + '\n'
      })
    }
    return str + '\n'
  }
}
