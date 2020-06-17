import cheerio from 'cheerio'
import axios from 'axios'

import { dhbList } from '../helpers/general-data'
import { getRegularCaseString } from '../helpers/general-helpers'

// Fetches testing rate data 
export async function fetchTestingData() {
    try {
      const html = await axios.get('/api/healthgovt/testing-rates')
      const cheerioParser = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
      try {
        return {
          dhbData: await fetchTestingRatesByDHB(cheerioParser),
          ethnicityData: await fetchTestingRatesByEthnicity(cheerioParser)
        }
      } catch(e) {
        console.log(e)
        return { error: 'No data was returned' }
      }
    } catch(e) {
      console.log(e)
      return { error: 'No data was returned' }
    }
}

// Fetches and returns testing rate data in each district health board
async function fetchTestingRatesByDHB(cheerioParser) {
    try {
        const $ = cheerioParser
        var dhbData = {}
        const dataTable = $('tbody')[0]

        $(dataTable).find('tr').each((rowIndex, row) => {
        let dhbObject = {}
        let dhbName = ''
        $(row).find('td').each((colIndex, col) => {
            let colData = $(col).text()
            if (colData === '&nbsp;') colData = 0
            if (colIndex === 0) dhbName = getRegularCaseString(colData.replace(/&nbsp;/g, ' '))
            else if (colIndex === 1) dhbObject.totalPeopleTested = parseInt(colData.replace(/,/g, '')) || 'N/A'
            else if (colIndex === 2) dhbObject.positiveTestRate = parseFloat(colData.replace(/%/g, '')) || 'N/A'
            else if (colIndex === 3) dhbObject.testRatePer1000 = parseInt(colData) || 'N/A'
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
        var correctFormatDHBList = dhbList.map(dhbObject => dhbObject.name)
        // If number of keys (DHBs) != 21, data is invalid
        if (Object.keys(dhbData).length !== 21) dataIsInvalid = true
        Object.keys(dhbData).forEach(function(k) {
          // If DHB name does not match spelling in provided DHB list (with exception of 'Unknown'), data is invalid
          if (!correctFormatDHBList.includes(k) && k !== 'Unknown') dataIsInvalid = true
          // If each DHB object's keys length != 3, data is invalid
          if (Object.keys(dhbData[k]).length !== 3) dataIsInvalid = true
        })

        if (dataIsInvalid) {
          console.log("Error: Data is invalid")
          return { error: 'Data is invalid' }
        }
        return dhbData
    } catch(e) {
        console.log(e)
        return { error: 'No data was returned' }
    }
}

// Fetches and returns testing rate data per ethnicity
async function fetchTestingRatesByEthnicity(cheerioParser) {
  try {
      const $ = cheerioParser
      var ethnicityData = {}
      const dataTable = $('tbody')[1]

      $(dataTable).find('tr').each((rowIndex, row) => {
      let ethnicityObject = {}
      let ethnicityName = ''
      $(row).find('td').each((colIndex, col) => {
          let colData = $(col).text()
          if (colData === '&nbsp;') colData = 0
          if (colIndex === 0) ethnicityName = getRegularCaseString(colData.replace(/&nbsp;/g, ' '))
          else if (colIndex === 1) ethnicityObject.totalPeopleTested = parseInt(colData.replace(/,/g, '')) || 'N/A'
          else if (colIndex === 2) ethnicityObject.positiveTestRate = parseFloat(colData.replace(/%/g, '')) || 'N/A'
          else if (colIndex === 3) ethnicityObject.testRatePer1000 = parseInt(colData) || 'N/A'
      })
      // Add DHB object of info to main object
      if (Object.keys(ethnicityObject).length > 0) ethnicityData[ethnicityName] = ethnicityObject
      })
      // Delete total count column
      delete ethnicityData.Total

      // A series of checks to see if data format is valid
      var dataIsInvalid = false
      // If number of keys (ethnicities) != 5, data is invalid
      if (Object.keys(ethnicityData).length !== 5) dataIsInvalid = true
      Object.keys(ethnicityData).forEach(function(k) {
        // If each ethnicity object's keys length != 3, data is invalid
        if (Object.keys(ethnicityData[k]).length !== 3) dataIsInvalid = true
      })

      if (dataIsInvalid) {
        console.log("Error: Data is invalid")
        return { error: 'Data is invalid' }
      }
      return ethnicityData
  } catch(e) {
      console.log(e)
      return { error: 'No data was returned' }
  }
}