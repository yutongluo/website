import { Format, FontStyle } from '../config'

export function formatText (format: string, text: string): string {
  if (FontStyle[format] === undefined) {
    throw new Error(`'Invalid style ${format} selected`)
  }
  return `${FontStyle[format] as string}${text}]`
};

export function formatDate (date: Date | undefined): string {
  if (date === undefined) {
    return 'present'
  }

  const formatter = new Intl.DateTimeFormat(
    'en-US',
    { year: 'numeric', month: 'short', timeZone: 'UTC' })
  return formatter.format(date)
}

export function formatBullet (text: string): string {
  if (text === '') return ''
  return '*' + ' '.repeat(Format.BulletPtIndent - 1) + splitLines(text, Format.BulletPtIndent)
}

export function createLink (text: string, url: string): string {
  return `[[bu!;#6c71c4;;;${url}]${text}]`
}

/**
  * splits lines by words when line width exceeds global colWidth
  * @param str string to split
  * @param indent indentation after second line. defaults to zero
  * @returns split string
  */
export function splitLines (str: string, indent?: number): string {
  const words = str.split(' ')
  let col = 0
  let newColSize = 0
  let line = ''
  let ret = ''

  indent = indent ?? 0
  const indentSpaces = ' '.repeat(indent)
  line = ''

  for (let i = 0; i < words.length;) {
    const word = words[i]
    if (word === undefined) {
      continue
    }
    newColSize = col + word.length + 1
    if (newColSize > Format.CharsPerLine && line !== '') {
      // new word is not going to fit, start a new line
      line += '\n'
      col = 0
      ret += line
      line = indentSpaces
    } else {
      col = newColSize
      line += `${words[i++] as string} `
    }
  }
  // something's left
  if (line !== '') {
    ret += line
  }

  return ret
};
