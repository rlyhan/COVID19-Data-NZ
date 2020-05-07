import cheerio from 'cheerio'
import axios from 'axios'

import { dhbList } from '../helpers/general-data'
import { getRegularCaseString } from '../helpers/general-helpers'

// Fetches current COVID-19 data
export async function fetchCurrentData() {
  const html = await axios.get('/api/healthgovt/current-data')
  const cheerioParser = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
  return {
    summaryData: await fetchCurrentSummaryData(cheerioParser),
    dhbData: await fetchCurrentDHBData(cheerioParser),
    testingData: await fetchCurrentTestingData(cheerioParser)
  }
}

// Fetches and returns data about overall numbers of COVID-19 cases nationwide
async function fetchCurrentSummaryData(cheerioParser) {

  const $ = cheerioParser
  var summaryData = {
    confirmedCases: {},
    probableCases: {},
    confirmedAndProbableCases: {},
    hospitalCases: {},
    recoveredCases: {},
    deaths: {}
  }

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

// Fetches and returns current data about COVID-19 case figures in each district helth board
async function fetchCurrentDHBData(cheerioParser) {

  const $ = cheerioParser
  var dhbData = {}

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
  // Delete total count column
  delete dhbData.Total

  // A series of checks to see if data format is valid
  var dataIsInvalid = false
  // Check each property (DHB name) matches the spellings in provided DHB list
  var correctFormatDHBList = dhbList.map(dhbObject => dhbObject.name)
  Object.keys(dhbData).forEach(function(apiDHBName) {
    if (!correctFormatDHBList.includes(apiDHBName)) {
      dataIsInvalid = true
    }
  })
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

// Fetches and returns current data about COVID-19 testing
async function fetchCurrentTestingData(cheerioParser) {

  const $ = cheerioParser
  var testingData = {
    testedYesterday: {},
    sevenDayAverage: {},
    totalToDate: {},
    suppliesInStock: {}
  }

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
  // Check each entry in test data (first column should be number,
  // second column should be string) else data is invalid
  Object.keys(testingData).forEach(function(k) {
    Object.entries(testingData[k]).forEach(function(j, index) {
      if (index === 0) {
        if (isNaN(j[1])) dataIsInvalid = true
      } else if (index === 1) {
        if (typeof(j[1]) !== 'string') {
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

  // Run a check to see if columns are named correctly
  var dataIsInvalid = false
  var rowSamples = [apiData.data.confirmed[apiData.data.confirmed.length-1], apiData.data.probable[0]]
  rowSamples.forEach(function(row) {
    if (!row['Age group'] || !row['Arrival date'] || !row['DHB'] || !row['Date notified of potential case'] ||
      !row['Flight departure date'] || !row['Flight number'] || !row['Last country before return'] ||
      !row['Overseas travel'] || !row['Sex']) dataIsInvalid = true
  })
  if (dataIsInvalid) return { error: 'Data is invalid' }

  // Extract case data from both confirmed and probable cases
  allCases.confirmed = extractCaseData(apiData.data.confirmed)
  allCases.probable = extractCaseData(apiData.data.probable)

  return allCases
}

// Reads each COVID-19 case, formatting each case as a JSON object and pushing to array
function extractCaseData(apiData) {
  var cases = []
  apiData.forEach(function(currentValue) {
    let date = currentValue['Date notified of potential case'].split('/')
    cases.push({
      "reportDate": new Date(`${date[2]}-${date[1]}-${date[0]}`),
      "sex": currentValue['Sex'],
      "ageGroup": currentValue['Age group'],
      "districtHealthBoard": currentValue['DHB'],
      "overseas": (currentValue['Overseas travel'] === "Yes") ? true :
                  (currentValue['Overseas travel'] === "No") ? false : "N/A",
      "lastCountryBeforeNZ": currentValue['Last country before return'],
      "flightNumber": currentValue['Flight number'],
      "departureDate": currentValue['Flight departure date'] !== "N/A" ?
                       new Date(currentValue['Flight departure date']) : "N/A",
      "arrivalDate": currentValue['Arrival date'] !== "N/A" ?
                     new Date(currentValue['Arrival date']) : "N/A"
    })
  })
  return cases
}
