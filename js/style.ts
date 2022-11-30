/* eslint-disable @typescript-eslint/restrict-template-expressions */

// Styles with solarized color scheme <3
const styles: { [id: string]: string } = {
  bold: '[[b;#fdf6e3;]',
  glow: '[[g;#fdf6e3;]',
  green: '[[;#859900;]',
  yellow: '[[;#b58900;]',
  orange: '[[;#cb4b16;]',
  magenta: '[[;#d33682;]',
  violet: '[[;#6c71c4;]',
  blue: '[[;#268bd2;]',
  cyan: '[[;#2aa198;]',
  heading: '[[bug;#2aa198;]',
  company: '[[bg;#268bd2;]',
  skill: '[[bg;#859900;]'
}

const monthShortNames: { [id: string]: string } = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'Aug',
  '09': 'Sept',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const bulletPointIndent = 2

export const colWidth = 80

export function formatText (format: string, text: string): string {
  return `${styles[format]}${text}]`
};

export function formatDate (date: string): string {
  if (date === 'present') {
    return date
  }
  const year = date.substring(0, 4)
  const month = date.substring(5, 7)
  return `${monthShortNames[month]} ${year}`
}

export function formatBullet (text: string): string {
  return '* ' + splitLines(text, bulletPointIndent)
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
    newColSize = col + words[i].length + 1
    if (newColSize > colWidth && line !== '') {
      // new word is not going to fit
      line += '\n'
      col = 0
      ret += line
      line = indentSpaces
    } else {
      col = newColSize
      line += `${words[i++]} `
    }
  }
  // something's left
  if (line !== '') {
    ret += line
  }

  return ret
};
