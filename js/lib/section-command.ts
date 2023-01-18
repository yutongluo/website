export class SectionCommand {
  public name: string
  public helpText: string
  public sections: string[]
  constructor (name: string, helpText: string, sections: string[]) {
    this.name = name
    this.helpText = helpText
    this.sections = sections
  }
}
