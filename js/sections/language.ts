import { formatText } from '../lib/style'
import type { IArraySection } from './array-section.interface'

interface JsonLanguage {
  language: string
  fluency: string | undefined
}

export class Language implements IArraySection {
  addLineBreaks = false
  private readonly language: JsonLanguage

  constructor (language: JsonLanguage) {
    this.language = language
  }

  public toString = (): string => {
    const fluencyStr = this.language.fluency === undefined ? '' : ` - ${this.language.fluency}`
    return formatText('bold', this.language.language + fluencyStr) + '\n'
  }
}
