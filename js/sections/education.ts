import { Format } from '../config'
import { formatBullet, formatDate, formatText } from '../lib/style'
import { hasContent } from '../lib/utils'
import type { ISection } from './section.interface'

interface JsonEducation {
  institution: string
  url: string | undefined
  area: string | undefined
  studyType: string | undefined
  startDate: string | undefined
  endDate: string | undefined
  score: string | undefined
  courses: string[] | undefined
}

export class Education implements ISection {
  private readonly education: JsonEducation

  constructor (education: JsonEducation) {
    this.education = education
  }

  public toString = (): string => {
    let str = ''
    str += formatText('company', this.education.institution)
    if (this.education.startDate !== undefined) {
      const startDate = new Date(this.education.startDate)
      const endDate = this.education.endDate === undefined
        ? undefined
        : new Date(this.education.endDate)
      const dates = formatDate(startDate) + '-' + formatDate(endDate)
      str += ' '.repeat(Format.CharsPerLine - this.education.institution.length - dates.length)
      str += formatText('date', dates)
    }
    str += '\n'

    let areaStr = ''
    if (hasContent(this.education.area)) {
      if (hasContent(this.education.studyType)) {
        areaStr = `${this.education.studyType as string} in `
      }
      areaStr += this.education.area as string
      str += formatText('description', areaStr)
    }
    if (hasContent(this.education.score)) {
      const score = `GPA: ${this.education.score as string}`
      if (this.education.area !== undefined) {
        str += ' '.repeat(Format.CharsPerLine - areaStr.length - score.length)
      }
      str += score
    }
    str += '\n'

    if (hasContent(this.education.url)) {
      str += formatText('url', this.education.url as string) + '\n'
    }
    if (this.education.courses !== undefined) {
      this.education.courses.forEach(course => {
        str += formatBullet(course) + '\n'
      })
    }
    return str
  }
}
