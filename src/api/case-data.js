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
      let departureDate = currentValue['Flight departure date']
      let arrivalDate = currentValue['Arrival date']
      let caseObject = {
        "reportDate": convertDateToString(reportDate, 'simple'),
        "sex": currentValue['Sex'],
        "ageGroup": currentValue['Age group'],
        "districtHealthBoard": currentValue['DHB'],
        "overseas": (currentValue['Overseas travel'] === "Yes") ? true :
                    (currentValue['Overseas travel'] === "No") ? false : "N/A",
        "lastCountryBeforeNZ": currentValue['Last country before return'],
        "flightNumber": currentValue['Flight number'],
        "departureDate": departureDate === "N/A" ? "N/A" : convertDateToString(departureDate, 'simple'),
        "arrivalDate": arrivalDate === "N/A" ? "N/A" : convertDateToString(arrivalDate, 'simple')
      }
      // Check dates are of valid format, else data is invalid
      if (reportDate === 'Invalid Date' || 
          (caseObject['departureDate'] !== "N/A" && new Date(caseObject['departureDate']).toString() === 'Invalid Date') || 
          (caseObject['arrivalDate'] !== "N/A" && new Date(caseObject['arrivalDate']).toString() === 'Invalid Date')) {
        dataIsInvalid = true
      }
      cases.push(caseObject)
    })
  
    if (dataIsInvalid) {
      console.log("Error: Data is invalid")
      return { error: 'Data is invalid' }
    }
    return cases
  }
  