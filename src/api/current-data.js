import cheerio from 'cheerio'
import axios from 'axios'

import { dhbList } from '../helpers/general-data'
import { getRegularCaseString } from '../helpers/general-helpers'

// Fetches current COVID-19 data
export async function fetchCurrentData() {
  try {
    const html = await axios.get('/api/healthgovt/current-data')
    const cheerioParser = await cheerio.load(html.data, {normalizeWhitespace: false, xmlMode: true})
    try {
      return {
        summaryData: await fetchCurrentSummaryData(cheerioParser),
        dhbData: await fetchCurrentDHBData(cheerioParser),
        ageGroupData: await fetchCurrentAgeGroupData(cheerioParser),
        testingData: await fetchCurrentTestingData(cheerioParser)
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

// Fetches and returns data about overall numbers of COVID-19 cases nationwide
async function fetchCurrentSummaryData(cheerioParser) {
  try {
    const $ = cheerioParser
    var summaryData = {
      confirmedCases: {},
      probableCases: {},
      confirmedAndProbableCases: {},
      recoveredCases: {},
      deaths: {},
      activeCases: {},
      hospitalCases: {}
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
        // Remove commas/other characters so can be parsed as int
        count = count.replace(/[^0-9-]*/g, '')
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
    // If number of rows != 7, data is invalid
    if (Object.keys(summaryData).length !== 7) dataIsInvalid = true
    Object.keys(summaryData).forEach(function(k) {
      // If number of columns != 2, data is invalid
      if (Object.keys(summaryData[k]).length !== 2) dataIsInvalid = true
      Object.entries(summaryData[k]).forEach(function(j) {
        // If each column value is not a number, data is invalid
        if (isNaN(j[1])) dataIsInvalid = true
      })
    })

    if (dataIsInvalid) {
      console.log("Error: Data is invalid")
      return { error: 'Data is invalid' }
    }
    return summaryData
  } catch(e) {
    console.log(e)
    return { error: 'No data was returned' }
  }
}

// Fetches and returns current data about COVID-19 case figures in each district health board
async function fetchCurrentDHBData(cheerioParser) {
  try {
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
    // var correctFormatDHBList = dhbList.map(dhbObject => dhbObject.name)
    // If number of keys (DHBs) != 20, data is invalid
    // if (Object.keys(dhbData).length !== 20) dataIsInvalid = true
    // Object.keys(dhbData).forEach(function(k) {
    //   // If DHB name does not match spelling in provided DHB list, data is invalid
    //   if (!correctFormatDHBList.includes(k)) dataIsInvalid = true
    //   // If DHB object's keys length != 5, data is invalid
    //   if (Object.keys(dhbData[k]).length !== 5) dataIsInvalid = true
    //   Object.entries(dhbData[k]).forEach(function(j) {
    //     // If each DHB object's entry is not a number, data is invalid
    //     if (isNaN(j[1])) dataIsInvalid = true
    //   })
    // })

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

// Fetches and returns data about cases by age group
async function fetchCurrentAgeGroupData(cheerioParser) {
  try {
    const $ = cheerioParser
    var ageGroupData = {}
    const dataTable = $('tbody')[3]

    $(dataTable).find('tr').each((rowIndex, row) => {
      var ageGroup = ''
      let ageGroupObject = {}
      $(row).find('td').each((colIndex, col) => {
        let colData = $(col).text()
        if (colData === '&nbsp;') colData = 0
        if (colIndex === 0) ageGroup = getRegularCaseString(colData)
        else if (colIndex === 1) ageGroupObject.active = parseInt(colData)
        else if (colIndex === 2) ageGroupObject.recovered = parseInt(colData)
        else if (colIndex === 3) ageGroupObject.deceased = parseInt(colData)
        else if (colIndex === 4) ageGroupObject.total = parseInt(colData)
      })
      // Add age group object to main object
      if (Object.keys(ageGroupObject).length > 0) ageGroupData[ageGroup] = ageGroupObject
    })
    delete ageGroupData.Total

    // A series of checks to see if data format is valid
    var dataIsInvalid = false
    Object.keys(ageGroupData).forEach(function(k) {
      Object.entries(ageGroupData[k]).forEach(function(j) {
        // If each age group object's entry is not a number, data is invalid
        if (isNaN(j[1])) dataIsInvalid = true
      })
    })
    if (dataIsInvalid) {
      console.log("Error: Data is invalid")
      return { error: 'Data is invalid' }
    }

    return ageGroupData
  } catch(e) {
    console.log(e)
    return { error: 'No data was returned' }
  }
}

// Fetches and returns current data about COVID-19 testing
async function fetchCurrentTestingData(cheerioParser) {
  try {
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
          // Remove commas/other characters so can be parsed as int
          let count = colData.replace(/[^0-9-]*/g, '')
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
    // If number of rows is not 4, data is invalid
    if (Object.keys(testingData).length !== 4) dataIsInvalid = true
    Object.keys(testingData).forEach(function(k) {
      // If number of columns is not 2, data is invalid
      if (Object.keys(testingData[k]).length !== 2) dataIsInvalid = true
      Object.entries(testingData[k]).forEach(function(j, index) {
        // If first column != number and/or second column != string, data is invalid
        if (index === 0) {
          if (isNaN(j[1])) dataIsInvalid = true
        } else if (index === 1) {
          if (typeof(j[1]) !== 'string') {
            dataIsInvalid = true
          }
        }
      })
    })

    if (dataIsInvalid) {
      console.log("Error: Data is invalid")
      return { error: 'Data is invalid' }
    }
    return testingData
  } catch(e) {
    console.log(e)
    return { error: 'No data was returned' }
  }
}