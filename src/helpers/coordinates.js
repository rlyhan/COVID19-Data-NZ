import { group, formatCount } from './general-helpers'
import {
  getDateList,
  casesBetweenDates,
  convertDateToString,
  findEvent
} from './dates'

// Create an HTML for tooltip for a coordinate
function createTooltip(coordDate, coordValue) {
  var coordEvent = findEvent(coordDate) || ''
  var eventParagraph = coordEvent && `<p><span>${coordEvent.title.toUpperCase()}: </span><span>${coordEvent.description.toUpperCase()}</span></p>`
  return `<div class="tooltip">
    <p>${convertDateToString(coordDate, 'text').toUpperCase()}</p>
    <p>${formatCount(coordValue, '')}</p>
    ${eventParagraph || ''}
  </div>`
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
    if (new Date(b) < new Date(a)) return 1
    if (new Date(a) < new Date(b)) return -1 
    return 0
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

export function getLineCoordinates(cases, startDate, endDate, numberType) {
  if (numberType === "total") return getTotalCaseCoordinatesLine(cases, startDate, endDate)
  else if (numberType === "new") return getNewCaseCoordinatesLine(cases, startDate, endDate)
}

// Get coordinates for new cases each day on top of total cases overall
function getTotalCaseCoordinatesLine(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCasesByDate(cases, startDate, endDate)
  // In each coordinate, add the date and accumulative total cases on this date
  var dateList = getDateList(startDate, endDate)
  let totalCases = 0
  let annotationIndex = 0
  for (let index = 0; index < dateList.length; index++) {
    let currentDate = convertDateToString(dateList[index], 'simple')
    if (orderedCasesByDate[currentDate] !== undefined) totalCases += orderedCasesByDate[currentDate].length
    if (findEvent(dateList[index]) !== undefined) annotationIndex += 1
    coords.push([
      dateList[index], 
      totalCases, 
      createTooltip(dateList[index], totalCases),
      findEvent(dateList[index]) !== undefined ? String.fromCharCode(annotationIndex+64) : null
    ])
  }

  return coords
}

// Get coordinates for new cases each day
function getNewCaseCoordinatesLine(cases, startDate, endDate) {
  var coords = []
  let orderedCasesByDate = sortAndGroupCasesByDate(cases, startDate, endDate)

  // For each date between start date and end date, add a coordinate with the number of cases 
  // on date, or 0 if there are no cases on that date
  var dateList = getDateList(startDate, endDate)
  let annotationIndex = 0
  for (let index = 0; index < dateList.length; index++) {
    let currentDate = convertDateToString(dateList[index], 'simple')
    let newCases = orderedCasesByDate[currentDate] !== undefined ? orderedCasesByDate[currentDate].length : 0
    if (findEvent(dateList[index]) !== undefined) annotationIndex += 1
    coords.push([
      dateList[index], 
      newCases, 
      createTooltip(dateList[index], newCases),
      findEvent(dateList[index]) !== undefined ? String.fromCharCode(annotationIndex+64) : null
    ])
  }

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
