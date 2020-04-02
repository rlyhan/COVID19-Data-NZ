import moment from 'moment'

import { events, casesBetweenDates, convertDateToString } from './dates'

// Accepts the array and key
const group = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    )
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result
  }, {}) // empty object is the initial value for result object
}

// Sorts grouped cases object (date keys with case object arrays)
// in ascending order
function sortGroupedCases(cases) {
  var orderedGroupedCases = {}
  Object.keys(cases).sort(function(a, b) {
    return moment(convertDateToString(a)).diff(moment(convertDateToString(b)))
  }).forEach((key) => {
    orderedGroupedCases[key] = cases[key]
  })
  return orderedGroupedCases
}

// New cases between given start and end dates
function sortAndGroupCases(cases, startDate, endDate) {
  // Get cases filtered between start/end dates and group them by their report date
  var casesByDate = group(casesBetweenDates(cases, startDate, endDate), 'reportDate')
  // Sort case groups by date ascending
  return sortGroupedCases(casesByDate)
}

// Get event information based on given date
function getEvent(date) {
  for (var anEvent of events) {
    if (convertDateToString(anEvent.date) === convertDateToString(date)) {
      return [anEvent.title, anEvent.description]
    }
  }
  return [undefined, undefined]
}

/* Get new cases between given start and end dates based on chosen data display type */

// Get new cases each day
export function getNewCaseCoordinates(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCases(cases, startDate, endDate)

  Object.entries(orderedCasesByDate).forEach(([key, value]) => {
    let currentDate = new Date(key)
    coords.push([currentDate, value.length, ...getEvent(currentDate)])
  })
  return coords
}

// Get new cases each day on top of total cases overall
export function getTotalCaseCoordinates(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCases(cases, startDate, endDate)
  let totalCases = 0

  Object.entries(orderedCasesByDate).forEach(([key, value]) => {
    let currentDate = new Date(key)
    totalCases += value.length
    coords.push([currentDate, totalCases, ...getEvent(currentDate)])
  })

  return coords
}
