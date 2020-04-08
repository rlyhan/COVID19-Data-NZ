import moment from 'moment'

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
