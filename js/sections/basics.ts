
import { createLink, formatText, splitLines } from '../lib/style'
import { hasContent } from '../lib/utils'
import type { ISection } from './section.interface'

class Profile {
  readonly network: string
  readonly username: string
  readonly url: string | undefined

  constructor (network: string, username: string, url: string | undefined) {
    this.network = network
    this.username = username
    this.url = url
  }

  public toString = (): string => {
    let str = ''
    str += formatText('bold', this.network) + ': '

    // right align username
    if (hasContent(this.url)) {
      str += createLink(this.username, this.url as string)
    } else {
      str += formatText('blue', this.username)
    }
    str += '\n'
    return str
  }
}

interface JsonProfile {
  readonly network: string
  readonly username: string
  readonly url: string | undefined
}

interface JsonBasics {
  name: string
  label: string | undefined
  image: string | undefined
  email: string | undefined
  phone: string | undefined
  url: string | undefined
  summary: string | undefined
  profiles: JsonProfile[] | undefined
}

export class Basics implements ISection {
  private readonly basics: JsonBasics

  constructor (basics: JsonBasics) {
    this.basics = basics
  }

  public toString = (): string => {
    let str = ''
    str += formatText('bold', 'Name: ') + this.basics.name + '\n'
    if (hasContent(this.basics.label)) {
      str += `${formatText('bold', 'Role: ')}${this.basics.label as string}\n`
    }
    if (hasContent(this.basics.email)) {
      str += `${formatText('bold', 'Email: ')}${formatText('url', this.basics.email as string)}\n`
    }

    if (hasContent(this.basics.phone)) {
      str += `${formatText('bold', 'Phone: ')}${this.basics.phone as string}\n`
    }

    if (hasContent(this.basics.url)) {
      str += `${formatText('bold', 'Website: ')}${this.basics.url as string}\n`
    }

    if (hasContent(this.basics.summary)) {
      str += `${formatText('bold', 'Summary: ')}\n${splitLines(this.basics.summary as string)}\n`
    }

    if (this.basics.profiles !== undefined) {
      this.basics.profiles.forEach((jsonProfile: JsonProfile) => {
        const profile = new Profile(jsonProfile.network, jsonProfile.username, jsonProfile.url)
        str += `${profile.toString()}`
      })
    }
    return str
  }
}
