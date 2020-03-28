const cheerio = require('cheerio')
const axios = require('axios')

export async function fetchConfirmedCases() {

  var cases = []

  const html = await axios.get('/api/healthgovt/confirmed')
  const $ = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})

  $('tbody tr').each((index, row) => {

    let individualCase = {}
    let individualCaseData = []

    $(row).find('td').each((index, col) => {
      if ($(col).text() === '&nbsp;') individualCaseData.push('N/A')
      else individualCaseData.push($(col).text())
    })

    cases.push({
      "reportDate": individualCaseData[0],
      "sex": individualCaseData[1],
      "ageGroup": individualCaseData[2],
      "districtHealthBoard": individualCaseData[3],
      "overseas": individualCaseData[4],
      "lastCityBeforeNZ": individualCaseData[5],
      "flightNumber": individualCaseData[6],
      "departureDate": individualCaseData[7],
      "arrivalDate": individualCaseData[8]
    })
  })

  return cases
}
