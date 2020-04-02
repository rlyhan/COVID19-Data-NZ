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
      let count = $(col).text()
      if (count === "&nbsp;") count = 0

      if (colIndex === 1) {
        summaryData[caseType].totalToDate = parseInt(count)
      } else if (colIndex === 2) {
        summaryData[caseType].newInLast24Hr = parseInt(count)
      }
    })
  })

  return summaryData
}

export async function fetchCases() {
  var allCases = {}

  const html = await axios.get('/api/healthgovt/confirmed')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})

  const confirmed = $('tbody')[0]
  const probable = $('tbody')[2]

  allCases.confirmed = extractCaseData($, confirmed)
  allCases.probable = extractCaseData($, probable)

  return allCases
}

function extractCaseData(htmlLoader, table) {
  const $ = htmlLoader
  var cases = []

  $(table).find('tr').each((rowIndex, row) => {
    let individualCaseData = []

    $(row).find('td').each((colIndex, col) => {
      if ($(col).text() === "&nbsp;") individualCaseData.push("N/A")
      else if ($(col).text() === "Yes") individualCaseData.push(true)
      else if ($(col).text() === "No") individualCaseData.push(false)
      else individualCaseData.push($(col).text())
    })

    cases.push({
      "reportDate": convertStringToDate(individualCaseData[0]),
      "sex": individualCaseData[1],
      "ageGroup": individualCaseData[2],
      "districtHealthBoard": individualCaseData[3],
      "overseas": individualCaseData[4],
      "lastCityBeforeNZ": individualCaseData[5],
      "flightNumber": individualCaseData[6],
      "departureDate": convertStringToDate(individualCaseData[7]),
      "arrivalDate": convertStringToDate(individualCaseData[8])
    })
  })

  return cases
}
