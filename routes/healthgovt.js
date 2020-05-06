const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
if(typeof require !== 'undefined') XLSX = require('xlsx')

const router = express.Router()

// Parse XLSX file from health.govt.nz
const caseFile = XLSX.readFile('./src/all-cases.xlsx', {cellDates: true})

// Link to official health.govt.nz data
const summary = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases'

/* Get overall case information in total + last 24 hours */
router.get('/current-data', (req, res) => {
  return axios.get(summary)
    .then(page => {
      res.send(page.data)
    })
    .catch(err => {
      res.status(500).json({})
    })
})

/* Get information about every single case */
router.get('/allcases', (req, res) => {
  res.json({
    confirmed: XLSX.utils.sheet_to_json(caseFile.Sheets[caseFile.SheetNames[0]], {range: 3}),
    probable: XLSX.utils.sheet_to_json(caseFile.Sheets[caseFile.SheetNames[1]], {range: 3})
  })
})

module.exports = router
