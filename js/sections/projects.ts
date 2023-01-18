import * as style from '../lib/style'
import { Format } from '../config'
import { hasContent } from '../lib/utils'
import { formatBullet } from '../lib/style'
import type { IArraySection } from './array-section.interface'

interface JsonProject {
  name: string
  entity: string | undefined
  type: string
  roles: string[] | undefined
  url: string | undefined
  startDate: Date | undefined
  endDate: Date | undefined
  description: string | undefined
  highlights: string[] | undefined
  keywords: string[] | undefined
}

export class Project implements IArraySection {
  addLineBreaks = true
  private readonly project: JsonProject

  constructor (project: JsonProject) {
    this.project = project
  }

  public toString = (): string => {
    let str = ''
    str += style.formatText('company', this.project.name)

    if (this.project.startDate !== undefined) {
      // right align dates
      const startDate = new Date(this.project.startDate)
      const endDate = this.project.endDate === undefined
        ? undefined
        : new Date(this.project.endDate)
      const dates = style.formatDate(startDate) + '-' + style.formatDate(endDate)
      str += ' '.repeat(Format.CharsPerLine - this.project.name.length - dates.length)
      str += style.formatText('date', dates)
    }
    str += '\n'

    if (hasContent(this.project.entity)) {
      str += style.formatText('description', this.project.entity as string) + '\n'
    }

    if (this.project.roles !== undefined && this.project.roles.length > 0) {
      str += style.formatText('role', this.project.roles.join(', '))
    }
    // right align project type
    if (this.project.type !== undefined) {
      if (this.project.roles !== undefined && this.project.roles.length > 0) {
        str += ' '.repeat(Format.CharsPerLine - this.project.roles.join(', ').length - this.project.type.length)
      }
      str += style.formatText('bold', this.project.type) + '\n'
    }

    if (hasContent(this.project.url)) {
      str += style.splitLines(style.formatText('url', this.project.url as string)) + '\n'
    }

    if (hasContent(this.project.description)) {
      str += style.splitLines(this.project.description as string) + '\n'
    }

    if (this.project.highlights !== undefined) {
      this.project.highlights.forEach(element => {
        str += style.formatBullet(element) + '\n'
      })
    }

    if (this.project.keywords !== undefined) {
      this.project.keywords.forEach(keyword => {
        str += formatBullet(keyword) + '\n'
      })
    }
    return str
  }
}
