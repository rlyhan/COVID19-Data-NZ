import moment from 'moment'

import {
  casesBetweenDates,
  convertDateToString,
  findNearestCoordinateToEvent
} from './dates'
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

// Adds events to coordinates for chart
function addEventsToCoords(coords, dataType) {
  for (let index = 0; index < events.length; index++) {
    let anEvent = events[index]
    // Find valid coordinate by seeing if its date matches an event's date
    var validCoord = coords.find(coord => convertDateToString(coord[0], 'simple') === convertDateToString(anEvent.date, 'simple'))
    if (validCoord) {
      // If a coordinate is found with a date matching event, add
      // the event details to this coordinate
      validCoord[2] = anEvent.title
      validCoord[3] = anEvent.description
    } else {
      // Else, if a coordinate cannot be found with a date matching event...

      // If showing total cases, create a new coordinate where its number of cases
      // equals that of the nearest preceding coordinate
      // (or the chart will show the number of cases on this event's date as 0!)

      // Else, if showing new cases, create a new coordinate with just 0 cases
      // (because no new cases were recorded on this event's date )

      if (dataType === 'total') {
        var precedingCoord = findNearestCoordinateToEvent(coords, anEvent.date)
        coords.push([anEvent.date, precedingCoord[1], anEvent.title, anEvent.description])
      } else if (dataType === 'new') {
        coords.push([anEvent.date, 0, anEvent.title, anEvent.description])
      }
    }
  }
  // Make sure coordinate array is in order before returning
  return coords.sort((a, b) => a[0] - b[0])
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
    return moment(convertDateToString(a, 'simple')).diff(moment(convertDateToString(b, 'simple')))
  }).forEach((key) => {
    orderedGroupedCases[key] = cases[key]
  })
  return orderedGroupedCases
}

/* HELPERS FOR CASES GROUPED BY DHB */

// Takes cases
// Returns object with DHB as properties holding an array of all cases
// reported from respective DHB, sorted alphabetically by DHB
export function sortAndGroupCasesByDHB(cases) {
  // Get cases grouped by their district health board
  var casesByDHB = group(cases, 'districtHealthBoard')
  // Sort case groups by DHB alphabetically
  return sortDHBGroupedCases(casesByDHB)
}

// Sorts grouped cases object (DHB keys with array of case objects)
// in order of number of cases
function sortDHBGroupedCases(cases) {
  var orderedGroupedCases = {}
  Object.keys(cases).sort(function(a, b) {
    if (cases[a].length < cases[b].length) return 1
    if (cases[b].length < cases[a].length) return -1
    return 0
  }).forEach((key) => {
    orderedGroupedCases[key] = cases[key]
  })
  return orderedGroupedCases
}

/* ANNOTATION CHART */

export function getAnnotationCoordinates(cases, startDate, endDate, numberType) {
  if (numberType === "total") return getTotalCaseCoordinatesAnnotation(cases, startDate, endDate)
  else if (numberType === "new") return getNewCaseCoordinatesAnnotation(cases, startDate, endDate)
}

// Get coordinates for new cases each day on top of total cases overall
function getTotalCaseCoordinatesAnnotation(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCasesByDate(cases, startDate, endDate)
  let totalCases = 0

  // In each coordinate, add the date and accumulative total cases on this date
  Object.entries(orderedCasesByDate).forEach(([dateOfCases, listOfCases]) => {
    let currentDate = new Date(dateOfCases)
    totalCases += listOfCases.length
    coords.push([currentDate, totalCases, undefined, undefined])
  })

  // If the last coordinate's date is not the end date, add an extra coordinate
  // with the end date and the current total
  if (coords[coords.length-1][0] !== endDate) coords.push([endDate, totalCases, undefined, undefined])

  // Add events to coordinates
  coords = addEventsToCoords(coords, 'total')
  return coords
}

// Get coordinates for new cases each day
function getNewCaseCoordinatesAnnotation(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCasesByDate(cases, startDate, endDate)

  // In each coordinate, add the date and number of new cases on this date
  Object.entries(orderedCasesByDate).forEach(([dateOfCases, listOfCases]) => {
    let currentDate = new Date(dateOfCases)
    coords.push([currentDate, listOfCases.length, undefined, undefined])
  })

  // Add events to coordinates
  coords = addEventsToCoords(coords, 'new')
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
