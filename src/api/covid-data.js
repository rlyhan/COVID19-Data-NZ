import cheerio from 'cheerio'
import axios from 'axios'

import { convertStringToDate } from '../helpers/dates'

export async function fetchSummaryData() {

  var summaryData = {
    confirmedCases: {},
    probableCases: {},
    confirmedAndProbableCases: {},
    hospitalCases: {},
    recoveredCases: {},
    deaths: {}
  }

  const html = await axios.get('/api/healthgovt/summary')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
  const dataTable = $('tbody')[0]

  $(dataTable).find('tr').each((rowIndex, row) => {
    let caseType = Object.keys(summaryData)[rowIndex]

    $(row).find('td').each((colIndex, col) => {
      let count
      if (colIndex === 2) {
        count = $(col).find('b').text()
      } else {
        count = $(col).text()
      }

      if (count === '&nbsp;') count = 0

      if (colIndex === 0) {
        summaryData[caseType].totalToDate = count
      } else if (colIndex === 1) {
        summaryData[caseType].newInLast24Hr = count
      }
    })
  })

  return summaryData
}

export async function fetchCases() {
  var allCases = {}

  const apiData = await axios.get('/api/healthgovt/allcases')
  console.log(apiData.data)

  allCases.confirmed = extractCaseData(apiData.data.confirmed)
  allCases.probable = extractCaseData(apiData.data.probable)

  return allCases
}

function extractCaseData(apiData) {
  var cases = []
  apiData.forEach(function(currentValue) {
    cases.push({
      "reportDate": new Date(currentValue['Date of report']),
      "sex": currentValue['Sex'] ? currentValue['Sex'] : "N/A",
      "ageGroup": currentValue['Age group'] ? currentValue['Age group'] : "N/A",
      "districtHealthBoard": currentValue['DHB'] ? currentValue['DHB'] : "N/A",
      "overseas": currentValue['International travel'] === "Yes" ? true :
                  currentValue['International travel'] === "No" ? false :
                  "N/A",
      "lastCountryBeforeNZ": currentValue['Last country before return'] ?
                             currentValue['Last country before return'] : "N/A",
      "flightNumber": currentValue['Flight number'] ? currentValue['Flight number'] : "N/A",
      "departureDate": currentValue['Flight departure date'] ?
                       new Date(currentValue['Flight departure date']) : "N/A",
      "arrivalDate": currentValue['Flight departure date'] ?
                     new Date(currentValue['Arrival date']) : "N/A"
    })
  })
  console.log(cases)
  return cases
}

/* ORIGINAL WEB SCRAPER TO FETCH CASE DATA (NO LONGER WORKS WITH CURRENT HEALTH.GOVT LAYOUT) */

// export async function fetchCases() {
//   var allCases = {}
//
//   const html = await axios.get('/api/healthgovt/allcases')
//   const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
//
//   const confirmed = $('tbody')[0]
//   const probable = $('tbody')[1]
//
//   allCases.confirmed = extractCaseData($, confirmed)
//   allCases.probable = extractCaseData($, probable)
//
//   console.log(allCases)
//
//   return allCases
// }
//
// function extractCaseData(htmlLoader, table) {
//   const $ = htmlLoader
//   var cases = []
//
//   $(table).find('tr').each((rowIndex, row) => {
//     let individualCaseData = []
//
//     $(row).find('td').each((colIndex, col) => {
//       if ($(col).text() === "&nbsp;") individualCaseData.push("N/A")
//       else if ($(col).text() === "Yes") individualCaseData.push(true)
//       else if ($(col).text() === "No") individualCaseData.push(false)
//       else individualCaseData.push($(col).text())
//     })
//
//     cases.push({
//       "reportDate": convertStringToDate(individualCaseData[0]),
//       "sex": individualCaseData[1],
//       "ageGroup": individualCaseData[2],
//       "districtHealthBoard": individualCaseData[3],
//       "overseas": individualCaseData[4],
//       "lastCityBeforeNZ": individualCaseData[5],
//       "flightNumber": individualCaseData[6],
//       "departureDate": convertStringToDate(individualCaseData[7]),
//       "arrivalDate": convertStringToDate(individualCaseData[8])
//     })
//   })
//
//   return cases
// }
