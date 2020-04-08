import moment from 'moment'

import { casesBetweenDates, convertDateToString } from './dates'
import { events } from './general-data'

// Takes an array of objects and a key property of each object
// Returns object
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

// Get event information based on given date
function getEvent(date) {
  for (var anEvent of events) {
    if (convertDateToString(anEvent.date) === convertDateToString(date)) {
      return [anEvent.title, anEvent.description]
    }
  }
  return [undefined, undefined]
}

/* HELPERS FOR CASES GROUPED BY DATE */

// Takes cases between dates
// Returns object with dates as properties holding an array of all cases
// reported on respective date
// Sorted by ascending date
function sortAndGroupCasesByDate(cases, startDate, endDate) {
  // Get cases between start/end dates and group them by their report date
  var casesByDate = group(casesBetweenDates(cases, startDate, endDate), 'reportDate')
  // Sort case groups by date ascending
  return sortDateGroupedCases(casesByDate)
}

// Sorts grouped cases object (date keys with array of case objects)
// in ascending order of date
function sortDateGroupedCases(cases) {
  var orderedGroupedCases = {}
  Object.keys(cases).sort(function(a, b) {
    return moment(convertDateToString(a)).diff(moment(convertDateToString(b)))
  }).forEach((key) => {
    orderedGroupedCases[key] = cases[key]
  })
  return orderedGroupedCases
}

/* HELPERS FOR CASES GROUPED BY DHB */

// Takes cases
// Returns object with DHB as properties holding an array of all cases
// reported from respective DHB
// Sorted alphabetically by DHB
function sortAndGroupCasesByDHB(cases) {
  // Get cases grouped by their district health board
  var casesByDHB = group(cases, 'districtHealthBoard')
  // Sort case groups by DHB alphabetically
  return sortDHBGroupedCases(casesByDHB)
}

// Sorts grouped cases object (DHB keys with array of case objects)
// in alphabetical order of DHB
function sortDHBGroupedCases(cases) {
  var orderedGroupedCases = {}
  Object.keys(cases).sort(function(a, b) {
    if (a > b) return 1
    if (b > a) return -1
    return 0
  }).forEach((key) => {
    orderedGroupedCases[key] = cases[key]
  })
  return orderedGroupedCases
}

/* ANNOTATION CHART */

export function getAnnotationCoordinates(cases, startDate, endDate, numberType) {
  switch(numberType) {
    case "total":
      return getTotalCaseCoordinatesAnnotation(cases, startDate, endDate)
      break;
    case "new":
      return getNewCaseCoordinatesAnnotation(cases, startDate, endDate)
      break;
  }
}

// Get coordinates for new cases each day on top of total cases overall
function getTotalCaseCoordinatesAnnotation(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCasesByDate(cases, startDate, endDate)
  let totalCases = 0

  Object.entries(orderedCasesByDate).forEach(([dateOfCases, listOfCases]) => {
    let currentDate = new Date(dateOfCases)
    totalCases += listOfCases.length
    coords.push([currentDate, totalCases, ...getEvent(currentDate)])
  })
  return coords
}

// Get coordinates for new cases each day
function getNewCaseCoordinatesAnnotation(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCasesByDate(cases, startDate, endDate)

  Object.entries(orderedCasesByDate).forEach(([dateOfCases, listOfCases]) => {
    let currentDate = new Date(dateOfCases)
    coords.push([currentDate, listOfCases.length, ...getEvent(currentDate)])
  })
  return coords
}

/* BAR CHART */

// Get coordinates for number of cases for each DHB
export function getBarCoordinates(cases) {
  var coords = [['District Health Board', 'Number of Cases', { role: 'annotation'}]]

  let orderedCasesByDHB = sortAndGroupCasesByDHB(cases)
  Object.entries(orderedCasesByDHB).forEach(([dhb, listOfCases]) => {
    coords.push([dhb.toUpperCase(), listOfCases.length, `${listOfCases.length}`])
  })
  return coords
}
