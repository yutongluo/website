import { formatBullet, formatText } from '../lib/style'
import type { ISection } from './section.interface'

interface JsonSkill {
  name: string
  level: string | undefined
  keywords: string[] | undefined
}

export class Skill implements ISection {
  private readonly skill: JsonSkill

  constructor (skill: JsonSkill) {
    this.skill = skill
  }

  public toString = (): string => {
    const level = this.skill.level === undefined ? '' : ' - ' + this.skill.level
    let str = ''
    str += formatText('bold', this.skill.name + level) + '\n'
    if (this.skill.keywords !== undefined) {
      this.skill.keywords.forEach(keyword => {
        str += formatBullet(keyword) + '\n'
      })
    }
    return str
  }
}
