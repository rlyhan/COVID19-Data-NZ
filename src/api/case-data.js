import axios from 'axios'

import { convertDateToString } from '../helpers/dates'

// Fetches and returns entire list of each individual, detailed, COVID-19 case
export async function fetchCases() {
    var allCases = {}
    try {
      const apiData = await axios.get('/api/healthgovt/all-cases')
      // Extract case data from both confirmed and probable cases
      allCases.confirmed = extractCaseData(apiData.data.confirmed)
      allCases.probable = extractCaseData(apiData.data.probable)
      // If errors have been returned, return an error
      if (allCases.confirmed.error || allCases.probable.error) return { error: 'No data was returned' }
      return allCases
    } catch(e) {
      console.log(e)
      return { error: 'No data was returned' }
    }
  }
  
  // Reads each COVID-19 case, formatting each case as a JSON object and pushing to array
  function extractCaseData(apiData) {
    var cases = []
    var dataIsInvalid = false
  
    apiData.forEach(function(currentValue) {
      let reportDate = currentValue['Date notified of potential case']
      let caseObject = {
        "reportDate": convertDateToString(reportDate, 'simple'),
        "sex": currentValue['Sex'],
        "ageGroup": currentValue['Age group'],
        "districtHealthBoard": currentValue['DHB'],
        "overseas": (currentValue['Overseas travel'] === "Yes") ? true :
                    (currentValue['Overseas travel'] === "No") ? false : "N/A"
      }
      // Check dates are of valid format, else data is invalid
      if (reportDate === 'Invalid Date') dataIsInvalid = true
      cases.push(caseObject)
    })
  
    if (dataIsInvalid) {
      console.log("Error: Data is invalid")
      return { error: 'Data is invalid' }
    }
    return cases
  }
  