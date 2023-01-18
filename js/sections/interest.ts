import { formatBullet, formatText } from '../lib/style'
import type { ISection } from './section.interface'

interface JsonInterest {
  name: string
  keywords: string[] | undefined
}

export class Interest implements ISection {
  private readonly interest: JsonInterest

  constructor (interest: JsonInterest) {
    this.interest = interest
  }

  public toString = (): string => {
    let str = ''
    str += formatText('bold', this.interest.name) + '\n'
    if (this.interest.keywords !== undefined) {
      this.interest.keywords.forEach(keyword => {
        str += formatBullet(keyword) + '\n'
      })
    }
    return str
  }
}
