import type { ISection } from './section.interface'
/**
 * A section which is an array in JsonResume
 */
export interface IArraySection extends ISection {
  /**
   * Whether to add line break between section items.
   */
  addLineBreaks: boolean
}
