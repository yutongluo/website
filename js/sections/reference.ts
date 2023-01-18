import { formatText, splitLines } from '../lib/style'
import type { ISection } from './section.interface'

interface JsonReference {
  name: string
  reference: string
}

export class Reference implements ISection {
  private readonly reference: JsonReference

  constructor (reference: JsonReference) {
    this.reference = reference
  }

  public toString = (): string => {
    let str = ''
    str += formatText('bold', this.reference.name) + '\n'
    str += splitLines(this.reference.reference)
    return str
  }
}
