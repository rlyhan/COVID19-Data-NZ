import cheerio from 'cheerio'
import axios from 'axios'

import { convertStringToDate } from '../helpers/dates'
import { getRegularCaseString } from '../helpers/general-helpers'

// Fetches and returns data about overall numbers of COVID-19 cases nationwide
export async function fetchSummaryData() {

  var summaryData = {
    confirmedCases: {},
    probableCases: {},
    confirmedAndProbableCases: {},
    hospitalCases: {},
    recoveredCases: {},
    deaths: {}
  }

  const html = await axios.get('/api/healthgovt/current-data')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
  const dataTable = $('tbody')[0]

  $(dataTable).find('tr').each((rowIndex, row) => {
    let caseType = Object.keys(summaryData)[rowIndex]

    $(row).find('td').each((colIndex, col) => {

      let count
      // Special case: Second row is a bold element
      if (colIndex === 2) {
        count = $(col).find('b').text()
      } else {
        count = $(col).text()
      }
      // Remove commas so can be parsed as int
      count = count.replace(',', '')
      // Replace empty space character with 0
      // Else if is a different, non-number character, set count as NaN
      // Else parse count string into int
      if (count === '&nbsp;') count = 0
      else if (isNaN(count)) count = NaN
      else count = parseInt(count)

      if (colIndex === 0) {
        summaryData[caseType].totalToDate = count
      } else if (colIndex === 1) {
        summaryData[caseType].newInLast24Hr = count
      }
    })
  })

  // A series of checks to see if data format is valid
  var dataIsInvalid = false
  // Check each entry is a number, if not, data is invalid
  Object.keys(summaryData).forEach(function(k) {
    Object.entries(summaryData[k]).forEach(function(j) {
      if (isNaN(j[1])) {
        dataIsInvalid = true
      }
    })
  })

  if (dataIsInvalid) return { error: 'Data is invalid' }
  return summaryData
}

// Fetches and returns summary data about COVID-19 case figures in each district helth board
export async function fetchSummaryDHBData() {

  var dhbData = {}

  const html = await axios.get('/api/healthgovt/current-data')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
  const dataTable = $('tbody')[1]

  $(dataTable).find('tr').each((rowIndex, row) => {
    let dhbObject = {}
    let dhbName = ''
    $(row).find('td').each((colIndex, col) => {
      let colData = $(col).text()
      if (colData === '&nbsp;') colData = 0

      if (colIndex === 0) dhbName = getRegularCaseString(colData)
      else if (colIndex === 1) dhbObject.active = parseInt(colData)
      else if (colIndex === 2) dhbObject.recovered = parseInt(colData)
      else if (colIndex === 3) dhbObject.deceased = parseInt(colData)
      else if (colIndex === 4) dhbObject.total = parseInt(colData)
      else if (colIndex === 5) dhbObject.last24Hours = parseInt(colData)
    })
    // Special cases for safe formatting
    if (dhbName === 'Mid Central') dhbName = 'Midcentral'
    if (dhbName === 'Tairāwhiti') dhbName = 'Tairawhiti'
    if (dhbName === 'Waitematā') dhbName = 'Waitemata'
    // Add DHB object of info to main object
    if (Object.keys(dhbObject).length > 0) dhbData[dhbName] = dhbObject
  })
  delete dhbData.Total

  // A series of checks to see if data format is valid
  var dataIsInvalid = false
  // Check each property (DHB name) matches the format of provided DHB list

  // Check each entry in a DHB object is a number, if not, data is invalid
  Object.keys(dhbData).forEach(function(k) {
    Object.entries(dhbData[k]).forEach(function(j) {
      if (isNaN(j[1])) {
        dataIsInvalid = true
      }
    })
  })
  if (dataIsInvalid) return { error: 'Data is invalid' }

  return dhbData
}

// Fetches and returns summary data about COVID-19 testing
export async function fetchSummaryTestingData() {

  var testingData = {
    testedYesterday: {},
    sevenDayAverage: {},
    totalToDate: {},
    suppliesInStock: {}
  }

  const html = await axios.get('/api/healthgovt/current-data')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
  const dataTable = $('tbody')[5]

  $(dataTable).find('tr').each((rowIndex, row) => {

    let testingStatisticObject = Object.keys(testingData)[rowIndex]
    $(row).find('td').each((colIndex, col) => {

      let colData = $(col).text()
      if (colIndex === 0) {
        // If column is number of tests
        // Remove commas so can be parsed as int
        let count = colData.replace(',', '')
        // Replace empty space character with 0
        // Else if is a different, non-number character, set count as NaN
        // Else parse count string into int
        if (count === '&nbsp;') count = 0
        else if (isNaN(count)) count = NaN
        else count = parseInt(count)
        // Add to object
        testingData[testingStatisticObject].testCount = count
      } else if (colIndex === 1) {
        // Else if column is date, just add to object
        testingData[testingStatisticObject].date = colData
      }

    })
  })

  // A series of checks to see if data format is valid
  var dataIsInvalid = false
  // Check each property (DHB name) matches the format of provided DHB list

  // Check each entry in test data (first column should be number,
  // second column should be string) else data is invalid
  Object.keys(testingData).forEach(function(k) {
    Object.entries(testingData[k]).forEach(function(j, index) {
      if (index === 0) {
        if (isNaN(j[1])) dataIsInvalid = true
      } else if (index === 1) {
        if (typeof(j[1]) != 'string') {
          dataIsInvalid = true
        }
      }
    })
  })
  if (dataIsInvalid) return { error: 'Data is invalid' }

  return testingData
}

// Fetches and returns entire list of each individual, detailed, COVID-19 case
export async function fetchCases() {
  var allCases = {}
  const apiData = await axios.get('/api/healthgovt/allcases')

  allCases.confirmed = extractCaseData(apiData.data.confirmed)
  allCases.probable = extractCaseData(apiData.data.probable)

  return allCases
}

// Reads each COVID-19 case, formatting each case as a JSON object and pushing to array
function extractCaseData(apiData) {
  var cases = []
  apiData.forEach(function(currentValue) {
    let date = currentValue['Date of report'].split('/')
    cases.push({
      "reportDate": new Date(`${date[2]}-${date[1]}-${date[0]}`),
      "sex": currentValue['Sex'] ? currentValue['Sex'] : "N/A",
      "ageGroup": currentValue['Age group'] ? currentValue['Age group'] : "N/A",
      "districtHealthBoard": currentValue['DHB'] ? currentValue['DHB'] : "N/A",
      "overseas": currentValue['Overseas travel'] === "Yes" ? true :
                  currentValue['Overseas travel'] === "No" ? false :
                  "N/A",
      "lastCountryBeforeNZ": currentValue['Last country before return'] ?
                             currentValue['Last country before return'] : "N/A",
      "flightNumber": currentValue['Flight number'] ? currentValue['Flight number'] : "N/A",
      "departureDate": currentValue['Flight departure date'] ?
                       new Date(currentValue['Flight departure date']) : "N/A",
      "arrivalDate": currentValue['Arrival date'] ?
                     new Date(currentValue['Arrival date']) : "N/A"
    })
  })
  return cases
}
