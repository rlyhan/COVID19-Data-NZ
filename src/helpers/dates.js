import moment from 'moment'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const events = [
  {
    title: "First confirmed case of COVID-19 arrives in NZ",
    description: "Passenger returned from Iran via Indonesia",
    date: new Date('2020-02-26')
  },
  {
    title: "PM Jacinda Arden announces nationwide 4-level alert system",
    description: "Also announces NZ is at level 2",
    date: new Date('2020-03-21')
  },
  {
    title: "PM Jacinda Ardern announces alert level 3 effective immediately",
    description: "48 hours given for non-essential businesses to shut",
    date: new Date('2020-03-23')
  },
  {
    title: "Country's first day in alert level 4",
    description: "All non-essential businesses closed",
    date: new Date('2020-03-26')
  },
  {
    title: "First COVID-19 death in New Zealand",
    description: "Woman in her 70s from West Coast",
    date: new Date('2020-03-29')
  }
]


// Takes a date string formatted as DD/MM/YYYY
// Converts to JavaScript date
export function convertStringToDate(date) {
  if (!date || date === "N/A") return "N/A"
  var splitDate = date.split('/')
  return new Date(`${splitDate[2]} ${splitDate[1]} ${splitDate[0]}`)
}

// Takes a JavaScript date
// Converts to simple string of form YYYY/MM/DD, to make parsing suitable for Moment
export function convertDateToString(jsDate) {
  var givenDate = new Date(jsDate)
  let day = givenDate.getDate()
  let month = givenDate.getMonth()+1
  let year = givenDate.getFullYear()

  if (day < 10) day = `0${day}`
  if (month < 10) month = `0${month}`

  return `${year}-${month}-${day}`
}

// Takes data, given start and end dates
// Filters the data between start and end dates
export function casesBetweenDates(cases, startDate, endDate) {
  return cases.filter(function(currentValue) {
    let currentDate = moment(convertDateToString(currentValue.reportDate))
    return (currentDate.isSameOrAfter(convertDateToString(moment(startDate))) &&
            currentDate.isSameOrBefore(convertDateToString(moment(endDate))))
  })
}
