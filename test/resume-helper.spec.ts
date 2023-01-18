import { describe, expect, test } from '@jest/globals';
import  { ResumeHelper } from '../js/lib/resume-helper'
import resume from '../js/resume.json'


describe('ResumeHelper function', () => {
  test('should throw error when given undefined section name', () => {
    expect(() => new ResumeHelper().getSection('invalidformat')).toThrow(Error)
  })

  test('should render array based section correctly', () => {
    const rendered = new ResumeHelper().getSection('awards')
    // heading is rendered on its own line
    expect(rendered).toContain('AWARDS]\n')
    const awards = resume.awards
    awards.forEach(award => {
      for (var key in award) {
        if (key !== 'date') {
          expect(rendered).toContain(award[key as keyof typeof award])
        }
      }
    })
  })

  test('should render single section correctly', () => {
    const rendered = new ResumeHelper().getSection('basics')
    // heading is rendered on its own line
    expect(rendered).toContain('BASICS]\n')
    const basics = resume.basics
    for (var key in basics) {
      if (key !== 'location' && key !== 'profiles' && key !== 'summary') {
        expect(rendered).toContain(basics[key as keyof typeof basics])
      }
    }
  })
})
