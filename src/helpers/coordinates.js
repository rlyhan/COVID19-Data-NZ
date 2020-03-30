import moment from 'moment'

import { casesBetweenDates, convertISOToDate } from './dates'

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
    return moment(a).diff(moment(b))
  }).forEach((key) => {
    orderedGroupedCases[key] = cases[key]
  })
  return orderedGroupedCases
}

// Confirmed new cases between given start and end dates
export function confirmedCasesToCoords(cases, startDate, endDate) {
  var coords = []

  // Get cases filtered between start/end dates and group them by their report date
  var casesByDate = group(casesBetweenDates(cases, startDate, endDate), 'reportDate')

  // Sort cases by date
  var orderedCasesByDate = sortGroupedCases(casesByDate)

  console.log(orderedCasesByDate)

  // Create coordinates: Each coord being an array of [date, no. cases at date]
  Object.entries(orderedCasesByDate).forEach(([key, value]) => {
    coords.push([convertISOToDate(key), value.length])
  })

  return coords
}
