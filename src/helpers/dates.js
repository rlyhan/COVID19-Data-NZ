import moment from 'moment'

import { months } from './general-data'

// let thirtyDaysAgo = moment().subtract(30, 'days').toDate()
const today = new Date()

// Date of first confirmed case
export const firstConfirmedCaseDay = new Date('2020-02-26')

// Takes array of case objects
// Finds and returns reportDate key value that is closest to today's date
export function findNearestDateToToday(cases) {
  return cases.reduce(function (closestDate, currentValue, currentIndex) {
    return moment(today).diff(moment(currentValue.reportDate)) < moment(today).diff(moment(closestDate)) ?
      currentValue.reportDate : closestDate
  }, firstConfirmedCaseDay)
}

// Takes array of coordinate arrays
// Gets coordinate where its date is the closest preceding to given event date
// (If given event date - current coord date < given event date - closest coord so far's date
// And given event date - current coord date >= 1, ie. the day before event or earlier
// Make current coord newest closest coord)
export function findNearestCoordinateToEvent(coords, eventDate) {
  return coords.reduce(function (closestCoord, currentValue, currentIndex) {
    let currentCoordDiff = moment(eventDate).diff(moment(currentValue[0]))
    let closestCoordDiff = moment(eventDate).diff(moment(closestCoord[0]))
    return (currentCoordDiff < closestCoordDiff && currentCoordDiff >= 1) ?
      currentValue : closestCoord
  })
}

// Takes a date string formatted as DD/MM/YYYY
// Converts to JavaScript date
export function convertStringToDate(date) {
  if (!date || date === "N/A") return "N/A"
  var splitDate = date.split('/')
  return new Date(`${splitDate[2]} ${splitDate[1]} ${splitDate[0]}`)
}

// Takes a JavaScript date
// Converts to simple string of form YYYY/MM/DD, to make parsing suitable for Moment
export function convertDateToString(jsDate, format) {
  var givenDate = new Date(jsDate)
  let day = givenDate.getDate()
  let month = givenDate.getMonth()+1
  let year = givenDate.getFullYear()

  if (day < 10) day = `0${day}`
  if (month < 10) month = `0${month}`

  if (format === 'simple') return `${year}-${month}-${day}`
  else if (format === 'text') return `${day} ${months[month-1]}, ${year}`
}

// Takes data, given start and end dates
// Filters the data between start and end dates
export function casesBetweenDates(cases, startDate, endDate) {
  return cases.filter(function(currentValue) {
    let currentDate = moment(convertDateToString(currentValue.reportDate, 'simple'))
    return (currentDate.isSameOrAfter(convertDateToString(moment(startDate), 'simple')) &&
            currentDate.isSameOrBefore(convertDateToString(moment(endDate), 'simple')))
  })
}
