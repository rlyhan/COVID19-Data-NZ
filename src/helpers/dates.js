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

// Takes a date string formatted as DD/MM/YYYY
// Converts to ISO standard format date YYYY-DD-MM
export function convertToISO(date) {
  if (!date || date === "N/A") return "N/A"
  var splitDate = date.split('/')
  return new Date(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`)
}

// Takes an ISO date string
// Converts to formatted NZ style date (Day, Month, Year)
export function convertToNZDate(date) {
  var givenDate = new Date(date)
  // return new Date(`${givenDate.getDate()} ${months[givenDate.getMonth()]}, ${givenDate.getFullYear()}`)
  console.log(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate())
  return new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate())
}

// Takes data, given start and end dates
// Filters the data between start and end dates
export function casesBetweenDates(cases, startDate, endDate) {
  return cases.filter(function(currentValue) {
    let currentDate = moment(currentValue.reportDate)
    return (currentDate.isSameOrAfter(moment(startDate)) &&
            currentDate.isSameOrBefore(moment(endDate)))
  })
}
