import { Experience } from '../sections/experience'
import { formatText } from './style'
import resume from '../resume.json'
import { Basics } from '../sections/basics'
import { Education } from '../sections/education'
import { Language } from '../sections/language'
import { Skill } from '../sections/skill'
import { Interest } from '../sections/interest'
import { Reference } from '../sections/reference'
import { Award } from '../sections/award'
import type { ISection } from '../sections/section.interface'
import { Publication } from '../sections/publications'
import { Project } from '../sections/projects'

export class ResumeHelper {
  private readonly JsonResumeClassMapping: { [name: string]: new (s: any) => ISection } = {
    education: Education,
    awards: Award,
    interests: Interest,
    skills: Skill,
    languages: Language,
    references: Reference,
    work: Experience,
    volunteer: Experience,
    basics: Basics,
    publications: Publication,
    projects: Project
  }

  getSection (sectionName: string): string {
    const SectionClass = this.JsonResumeClassMapping[sectionName]
    if (SectionClass === undefined) {
      throw new Error('Unknown section ' + sectionName)
    }
    let str = ''
    const jsonSection = resume[sectionName as keyof typeof resume]
    if (jsonSection !== undefined) {
      if (Array.isArray(jsonSection) && jsonSection.length > 0) {
        str += formatText('heading', sectionName.toUpperCase()) + '\n'
        jsonSection.forEach((sectionContent: any) => {
          const section = new SectionClass(sectionContent)
          str += section.toString()
        })
      } else {
        str += formatText('heading', sectionName.toUpperCase()) + '\n'
        const section = new SectionClass(jsonSection)
        str += section.toString()
      }
    }
    return str
  }
}
