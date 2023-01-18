import { describe, expect, test } from '@jest/globals';
import { Basics } from '../js/sections/basics'
import { Experience } from '../js/sections/experience'
import { Project } from '../js/sections/projects'
import { Education } from '../js/sections/education'
import { Award } from '../js/sections/award'
import { Publication } from '../js/sections/publications'
import { Skill } from '../js/sections/skill'
import { Interest } from '../js/sections/interest'
import { Reference } from '../js/sections/reference'
import { Language } from '../js/sections/language'



describe('basics Section', () => {
  test('should render correctly with all fields', () => {
    var jsonBasics: any = {
      'name': 'Richard Hendriks',
      'label': 'Programmer',
      'image': '',
      'email': 'richard.hendriks@mail.com',
      'phone': '(912) 555-4321',
      'url': 'http://richardhendricks.example.com',
      'summary': 'Richard hails from Tulsa. He has earned degrees ...',
      'location': {
        'address': '2712 Broadway St',
        'postalCode': 'CA 94115',
        'city': 'San Francisco',
        'countryCode': 'US',
        'region': 'California'
      },
      'profiles': [
        {
          'network': 'Twitter',
          'username': 'neutralthoughts'
        },
        {
          'network': 'SoundCloud',
          'username': 'dandymusicnl',
          'url': 'https://soundcloud.example.com/dandymusicnl'
        },
      ]
    }

    var basics = new Basics(jsonBasics);
    var str = basics.toString()

    for (var key in jsonBasics) {
      if (key !== 'location' && key !== 'profiles') { // we don't render location
        expect(str).toContain(jsonBasics[key])
      }
    }

    var profiles = jsonBasics.profiles
    profiles.forEach((profile: any) => {
      for (var key in profile) {
        expect(str).toContain(profile[key])
      }
    })
  })
  test('should render correctly given only name field', () => {
    var jsonBasics: any = {
      name: 'bob'
    }
    var basics = new Basics(jsonBasics);
    var str = basics.toString()
    expect(str).toContain('bob')
  })
})

describe('work Experience Section', () => {
  test('should render correctly with all fields', () => {
    const jsonExperience: any = {
      'name': 'Pied Piper',
      'location': 'Palo Alto, CA',
      'description': 'Awesome compression company',
      'position': 'CEO/President',
      'url': 'http://piedpiper.example.com',
      'startDate': '2013-12-01',
      'endDate': '2014-12-01',
      'summary': 'Pied Piper is a multi-platform technology ...',
      'highlights': [
        'Build an algorithm for artist to detect if their music',
        'Successfully won Techcrunch Disrupt',
        'Optimized an algorithm that holds the current',
      ]
    }
    var experience = new Experience(jsonExperience);
    var str = experience.toString()
    for (var key in jsonExperience) {
      if (key !== 'highlights' && key !== 'startDate' && key !== 'endDate') {
        expect(str).toContain(jsonExperience[key])
      }
    }

    expect(str).toContain('Dec 2013')
    expect(str).toContain('Dec 2014')

    jsonExperience.highlights.forEach((highlight: any) => {
      expect(str).toContain(highlight)
    })
  })

  test('should render correctly with minimum fields', () => {
    const jsonExperience: any = {
      'name': 'Pied Piper',
      'position': 'CEO/President',
    }
    var experience = new Experience(jsonExperience);
    var str = experience.toString()
    for (var key in jsonExperience) {
      if (key !== 'highlights') { // we don't render location
        expect(str).toContain(jsonExperience[key])
      }
    }
  })

  test('should render correctly with start date and no end date (present)', () => {
    const jsonExperience: any = {
      'name': 'Pied Piper',
      'location': 'Palo Alto, CA',
      'position': 'CEO/President',
      'startDate': '2021-01-01'
    }
    var experience = new Experience(jsonExperience);
    var str = experience.toString()
    for (var key in jsonExperience) {
      if (key !== 'highlights' && key !== 'startDate') { // we don't render location
        expect(str).toContain(jsonExperience[key])
      }
    }
    expect(str).toContain('Jan 2021')
    expect(str).toContain('present')
  })
})

describe('volunteer Experience Section', () => {
  test('should render correctly with all fields', () => {
    const jsonExperience: any = {
      'organization': 'CoderDojo',
      'position': 'Teacher',
      'url': 'http://coderdojo.example.com/',
      'startDate': '2012-01-01',
      'endDate': '2013-01-01',
      'summary': 'Global movement of free coding clubs for young people.',
      'highlights': [
        'Awarded "Teacher of the Month"'
      ]
    }
    var experience = new Experience(jsonExperience);
    var str = experience.toString()
    for (var key in jsonExperience) {
      if (key !== 'highlights' && key !== 'startDate' && key !== 'endDate') {
        expect(str).toContain(jsonExperience[key])
      }
    }

    expect(str).toContain('Jan 2012')
    expect(str).toContain('Jan 2013')

    jsonExperience.highlights.forEach((highlight: any) => {
      expect(str).toContain(highlight)
    })
  })

  test('should render correctly with minimum fields', () => {
    const jsonExperience: any = {
      'organization': 'CoderDojo',
      'position': 'Teacher',
    }
    var experience = new Experience(jsonExperience);
    var str = experience.toString()
    for (var key in jsonExperience) {
      if (key !== 'highlights') { // we don't render location
        expect(str).toContain(jsonExperience[key])
      }
    }
  })

  test('should render correctly with start date and no end date (present)', () => {
    const jsonExperience: any = {
      'organization': 'CoderDojo',
      'position': 'Teacher',
      'startDate': '2021-01-01'
    }
    var experience = new Experience(jsonExperience);
    var str = experience.toString()
    for (var key in jsonExperience) {
      if (key !== 'highlights' && key !== 'startDate') { // we don't render location
        expect(str).toContain(jsonExperience[key])
      }
    }
    expect(str).toContain('Jan 2021')
    expect(str).toContain('present')
  })
})

describe('project section', () => {
  test('should render correctly with all fields', () => {
    const jsonProject: any = {
      'name': 'Miss Direction',
      'description': 'A mapping engine that misguides you',
      'highlights': [
        'Won award at AIHacks 2016',
        'Built by all women team of newbie programmers',
        'Using modern technologies such as GoogleMaps, Chrome Extension and Javascript'
      ],
      'keywords': [
        'GoogleMaps', 'Chrome Extension', 'Javascript'
      ],
      'startDate': '2016-08-24',
      'endDate': '2016-08-24',
      'url': 'missdirection.example.com',
      'roles': [
        'Team lead', 'Designer'
      ],
      'entity': 'Smoogle',
      'type': 'application'
    }
    var experience = new Project(jsonProject);
    var str = experience.toString()
    for (var key in jsonProject) {
      if (key !== 'highlights' && key !== 'startDate'
      && key !== 'endDate' && key !== 'keywords'
      && key !== 'roles') {
        expect(str).toContain(jsonProject[key])
      }
    }

    expect(str).toContain('Aug 2016')
    expect(str).toContain('Aug 2016')

    jsonProject.highlights.forEach((highlight: any) => {
      expect(str).toContain(highlight)
    })

    jsonProject.keywords.forEach((keyword: any) => {
      expect(str).toContain(keyword)
    })

    jsonProject.roles.forEach((role: any) => {
      expect(str).toContain(role)
    })
  })

  test('should render correctly with minimum fields', () => {
    const jsonProject: any = {
      'name': 'Miss Direction',
      'type': 'application',
    }
    var experience = new Project(jsonProject);
    var str = experience.toString()
    for (var key in jsonProject) {
      if (key !== 'highlights') { // we don't render location
        expect(str).toContain(jsonProject[key])
      }
    }
  })

  test('should render correctly with start date and no end date (present)', () => {
    const jsonProject: any = {
      'name': 'Miss Direction',
      'type': 'application',
      'startDate': '2021-01-01'
    }
    var project = new Project(jsonProject);
    var str = project.toString()
    for (var key in jsonProject) {
      if (key !== 'highlights' && key !== 'startDate') { // we don't render location
        expect(str).toContain(jsonProject[key])
      }
    }
    expect(str).toContain('Jan 2021')
    expect(str).toContain('present')
  })
})

describe('education section', () => {
  test('should render correctly with all fields', () => {
    const jsonEducation: any = {
      'institution': 'University of Oklahoma',
      'url': 'https://www.ou.edu/',
      'area': 'Information Technology',
      'studyType': 'Bachelor',
      'startDate': '2011-06-01',
      'endDate': '2014-01-01',
      'score': '4.0',
      'courses': [
        'DB1101 - Basic SQL',
        'CS2011 - Java Introduction'
      ]
    }
    var experience = new Education(jsonEducation);
    var str = experience.toString()
    for (var key in jsonEducation) {
      if (key !== 'courses' && key !== 'startDate' && key !== 'endDate') {
        expect(str).toContain(jsonEducation[key])
      }
    }

    expect(str).toContain('Jan 2014')
    expect(str).toContain('Jun 2011')

    jsonEducation.courses.forEach((course: any) => {
      expect(str).toContain(course)
    })
  })

  test('should render correctly with minimum fields', () => {
    const jsonEducation: any = {
      'institution': 'University of Resume'
    }
    var experience = new Education(jsonEducation);
    var str = experience.toString()
    expect(str).toContain('University of Resume')
  })

  test('should render correctly with start date and no end date (present)', () => {
    const jsonEducation: any = {
      'institution': 'University of Resume',
      'startDate': '2021-01-01'
    }
    var project = new Education(jsonEducation);
    var str = project.toString()
    for (var key in jsonEducation) {
      if (key !== 'highlights' && key !== 'startDate') { // we don't render location
        expect(str).toContain(jsonEducation[key])
      }
    }
    expect(str).toContain('Jan 2021')
    expect(str).toContain('present')
  })
})

describe('award section', () => {
  test('should render correctly with all fields', () => {
    const jsonAward: any = {
      'title': 'Digital Compression Pioneer Award',
      'date': '2014-11-01',
      'awarder': 'Techcrunch',
      'summary': 'There is no spoon.'
    }
    var award = new Award(jsonAward);
    var str = award.toString()
    for (var key in jsonAward) {
      if (key !== 'date') {
        expect(str).toContain(jsonAward[key])
      }
    }

    expect(str).toContain('Nov 2014')
  })

  test('should render correctly with minimum fields', () => {
    const jsonAward: any = {
      'title': 'Digital Compression Pioneer Award',
      'awarder': 'Techcrunch',
      'summary': 'There is no spoon.'
    }
    var award = new Award(jsonAward);
    var str = award.toString()
    for (var key in jsonAward) {
      expect(str).toContain(jsonAward[key])
    }
  })
})

describe('publication section', () => {
  test('should render correctly with all fields', () => {
    const jsonPublication: any = {
      "name": "Video compression for 3d media",
      "publisher": "Hooli",
      "releaseDate": "2014-10-01",
      "url": "http://en.wikipedia.org/wiki/Silicon_Valley_(TV_series)",
      "summary": "Innovative middle-out compression algorithm that changes the way we store data."
    }
    var publication = new Publication(jsonPublication);
    var str = publication.toString()
    for (var key in jsonPublication) {
      if (key !== 'releaseDate') {
        expect(str).toContain(jsonPublication[key])
      }
    }

    expect(str).toContain('Oct 2014')
  })

  test('should render correctly with minimum fields', () => {
    const jsonPublication: any = {
      'name': 'Digital Compression Pioneer Award',
    }
    var publication = new Publication(jsonPublication);
    var str = publication.toString()
    for (var key in jsonPublication) {
      expect(str).toContain(jsonPublication[key])
    }
  })
})

describe('skill section', () => {
  test('should render correctly with all fields', () => {
    const jsonSkill: any = {
      "name": "Compression",
      "level": "Master",
      "keywords": [
        "Mpeg",
        "MP4",
        "GIF"
      ]
    }
    var skill = new Skill(jsonSkill);
    var str = skill.toString()
    for (var key in jsonSkill) {
      if (key !== 'keywords') {
        expect(str).toContain(jsonSkill[key])
      }
    }

    jsonSkill.keywords.forEach((keyword: any) => {
      expect(str).toContain(keyword)
    })
  })

  test('should render correctly with minimum fields', () => {
    const jsonSkill: any = {
      'name': 'Compression',
    }
    var skill = new Skill(jsonSkill);
    var str = skill.toString()
    
    expect(str).toContain('Compression')
  })
})

describe('interest section', () => {
  test('should render correctly with all fields', () => {
    const jsonInterest: any = {
      "name": "Wildlife",
      "keywords": [
        "Ferrets",
        "Unicorns"
      ]
    }
    var interest = new Interest(jsonInterest);
    var str = interest.toString()
    for (var key in jsonInterest) {
      if (key !== 'keywords') {
        expect(str).toContain(jsonInterest[key])
      }
    }

    jsonInterest.keywords.forEach((keyword: any) => {
      expect(str).toContain(keyword)
    })
  })

  test('should render correctly with minimum fields', () => {
    const jsonInterest: any = {
      'name': 'Wildlife',
    }
    var interest = new Interest(jsonInterest);
    var str = interest.toString()
    
    expect(str).toContain('Wildlife')
  })
})

describe('references section', () => {
  test('should render correctly with all fields', () => {
    const jsonReference: any = {
      "name": "Erlich Bachman",
      "reference": "It is my pleasure to recommend Richard..."
    }
    var reference = new Reference(jsonReference);
    var str = reference.toString()
    for (var key in jsonReference) {
      expect(str).toContain(jsonReference[key])
    }
  })
})

describe('language section', () => {
  test('should render correctly with all fields', () => {
    const jsonLanguage: any = {
      "language": "English",
      "fluency": "Native speaker"
    }
    var reference = new Language(jsonLanguage);
    var str = reference.toString()
    for (var key in jsonLanguage) {
      expect(str).toContain(jsonLanguage[key])
    }
  })

  test('should render correctly with minimum fields', () => {
    const jsonLanguage: any = {
      "language": "English",
    }
    var reference = new Language(jsonLanguage);
    var str = reference.toString()
    
    expect(str).toContain('English')
  })
})