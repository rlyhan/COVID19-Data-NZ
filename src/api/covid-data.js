import cheerio from 'cheerio'
import axios from 'axios'

import { convertToISO } from '../helpers/dates'

export async function fetchConfirmedCases() {

  var cases = []

  const html = await axios.get('/api/healthgovt/confirmed')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
  const dataTable = $('tbody')[0]

  $(dataTable).find('tr').each((index, row) => {

    let individualCase = {}
    let individualCaseData = []

    $(row).find('td').each((index, col) => {
      if ($(col).text() === "&nbsp;") individualCaseData.push("N/A")
      else if ($(col).text() === "Yes") individualCaseData.push(true)
      else if ($(col).text() === "No") individualCaseData.push(false)
      else individualCaseData.push($(col).text())
    })

    cases.push({
      "reportDate": convertToISO(individualCaseData[0]),
      "sex": individualCaseData[1],
      "ageGroup": individualCaseData[2],
      "districtHealthBoard": individualCaseData[3],
      "overseas": individualCaseData[4],
      "lastCityBeforeNZ": individualCaseData[5],
      "flightNumber": individualCaseData[6],
      "departureDate": convertToISO(individualCaseData[7]),
      "arrivalDate": convertToISO(individualCaseData[8])
    })
  })

  return cases
}
