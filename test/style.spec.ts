import { describe, expect, test } from '@jest/globals';
import { formatBullet, formatText, splitLines } from '../js/lib/style'
import { Format } from '../js/config'

const longStr = 'a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long string'

describe('formatBullet function', () => {
  test('should format multiline string correctly based on indentation', () => {
    var bullet = formatBullet(longStr)
    var indent = ' '.repeat(Format.BulletPtIndent)
    var firstIndent = '*' + ' '.repeat(Format.BulletPtIndent - 1)
    expect(bullet).toEqual(
`${firstIndent}a very very very very very very very very very very very very very very very 
${indent}very very very very very very very very very very very very very very very very 
${indent}very long string `)
  })

  test('should format single line correctly based on indentation', () => {
    var bullet = formatBullet('single line bullet')
    var firstIndent = '*' + ' '.repeat(Format.BulletPtIndent - 1)
    expect(bullet).toEqual(`${firstIndent}single line bullet `)
  })

  test('should return empty string when given empty string', () => {
    var bullet = formatBullet('')
    expect(bullet).toEqual('')
  })
})

describe('formatText function', () => {
  test('should throw error when given undefined style', () => {
    expect(() => formatText('invalidformat', 'text')).toThrow(Error)
  })
})

describe('splitLines function', () => {
  // TODO: add more tests
  test('should preserve multiple spaces', () => {
    var repeatedSpacesLine = 'test     test   '
    expect(splitLines(repeatedSpacesLine)).toEqual(repeatedSpacesLine + ' ')
  })

  test('should preserve multiple spaces', () => {
    var spaces = ' '.repeat(Format.CharsPerLine - 1)
    expect(splitLines(spaces)).toEqual(spaces + ' ')
  })
})
