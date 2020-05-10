const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs')
if(typeof require !== 'undefined') XLSX = require('xlsx')

const router = express.Router()

// Link to official health.govt.nz data
const summary = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases'
const caseList = 'https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details'

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
  axios.get(caseList)
    .then(page => {
      // Load from web page
      const $ = cheerio.load(page.data, {normalizeWhitespace: false, xmlMode: true})
      const caseListLink = `https://www.health.govt.nz${$($('.field-items > div > ul')[1]).find('li > a').attr('href')}`
      // Write the XLSX file from link to new file called all-cases.xlsx
      const caseFileWriteStream = fs.createWriteStream('all-cases.xlsx')
      const request = https.get(caseListLink, function(response) {
        response.pipe(caseFileWriteStream)
        response.on('end', function() {
          fs.readFile('all-cases.xlsx', function(err, buffer) {
            allCases = XLSX.read(buffer, {type: 'buffer', cellDates: true})
            res.json({
              confirmed: XLSX.utils.sheet_to_json(allCases.Sheets[allCases.SheetNames[0]], {defval: "N/A", range: 3}),
              probable: XLSX.utils.sheet_to_json(allCases.Sheets[allCases.SheetNames[1]], {defval: "N/A", range: 3})
            })
          })
        })
        response.on('error', function() {
          res.status(500).json({})
        })
      })
    })
    .catch(err => {
      res.status(500).json({})
    })
})

module.exports = router
