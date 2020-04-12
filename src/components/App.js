import React, { Component } from 'react';
// import moment from 'moment'

import GoogleChart from './GoogleChart'
import SummaryData from './SummaryData'
import { fetchSummaryData, fetchCases } from '../api/covid-data'
import {
  getAnnotationCoordinates,
  getBarCoordinates
} from '../helpers/coordinates'

const firstConfirmedCaseDay = new Date('2020-02-26')
let today = new Date()
// let thirtyDaysAgo = moment().subtract(30, 'days').toDate()

class App extends Component {

  constructor() {
    super()
    this.state = {
      apiSummaryData: null,
      apiCaseData: {},
      googleChartData: [],
      dhbChartData: [], // Coords for barchart of DHB cases in summary data sidebar
      chosenCaseSet: [],  // Array of selected cases to be sent as co-ords
      chosenChartType: "annotation", // Tells which chart to show on page, ie. ANNOTATION / GEOCHART
      chosenCaseType: "both", // Tells whether to get CONFIRMED + PROBABLE / CONFIRMED ONLY cases
      chosenNumberType: "total" // Tells which co-ordinates to get, ie. TOTAL or NEW
      // chosenDHB: "nationwide" // ie. NATIONWIDE / AUCKLAND / CANTERBURY / etc
    }
  }

  componentDidMount() {
    // Fetch case summary data
    fetchSummaryData()
      .then(data => {
        this.setState({ apiSummaryData: data })
      })
    // Fetch cases from API
    // Get coordinates for charts
    // Initially shows ALL CASES ie. CONFIRMED + PROBABLE CASES / TOTAL NO. CASES
    fetchCases()
      .then(data => {
        this.setState({ apiCaseData: data }, () => {
          this.setChartData()
          this.setState({
            dhbChartData: getBarCoordinates(this.getAllCases())
          })
        })
      })
      .catch(err => this.setState({ googleChartData: null }))
  }

  // Helper: Gets ALL CASES from API data as array
  getAllCases = () => {
    return this.state.apiCaseData.confirmed.concat(this.state.apiCaseData.probable)
  }

  // Helper: Gets CONFIRMED CASES ONLY from API data as array
  getConfirmedCases = () => {
    return this.state.apiCaseData.confirmed
  }

  // Helper: Gets cases based on whether CONFIRMED or CONFIRMED + PROBABLE cases selected
  getCasesByType = () => {
    switch(this.state.chosenCaseType) {
      case "both":
        return this.getAllCases()
        break;
      case "confirmed":
        return this.getConfirmedCases()
        break;
    }
  }

  // Helper: Filter selected cases by DHB
  // getCasesByDHB = cases => {
  //   return this.state.chosenDHB === "nationwide" ? cases : cases.filter(currentValue =>
  //     currentValue.districtHealthBoard === this.state.chosenDHB
  //   )
  // }

  // Fetches coordinates for chart
  // 1. Initially have chosen case set in state (all or confirmed cases)
  // 2. Fetches coordinates based on chart type
  setChartData = () => {
    this.setState({
      chosenCaseSet: this.getCasesByType()
    }, () => {
      switch(this.state.chosenChartType) {
        case "annotation":
          this.setState({
            googleChartData: getAnnotationCoordinates(this.state.chosenCaseSet, firstConfirmedCaseDay, today, this.state.chosenNumberType)
          })
          break;
        case "bar":
          this.setState({
            googleChartData: getBarCoordinates(this.state.chosenCaseSet)
          })
          break;
      }
    })
  }

  // Toggle between getting TOTAL NO. CASES / NO. OF NEW CASES (for annotation chart only)
  // Calls chart data setter
  toggleNumberType = e => {
    // e.preventDefault()
    this.setState({ chosenNumberType: e.target.value }, () => this.setChartData())
  }

  // Toggles filtering of CONFIRMED + PROBABLE CASES / CONFIRMED CASES ONLY
  // Sets selected case type as a filter
  // Calls chart data setter
  toggleCaseType = e => {
    e.preventDefault()
    this.setState({ chosenCaseType: e.target.value }, () => this.setChartData())
  }

  // Toggles cases to show based on DHB
  // Sets selected DHB as a filter
  // Calls chart data setter
  // toggleDHB = e => {
  //   e.preventDefault()
  //   this.setState({ chosenDHB: e.target.value }, () => this.setChartData())
  // }

  // Toggle which chart to show
  toggleChartType = e => {
    e.preventDefault()
    this.setState({ chosenChartType: e.target.value }, () => this.setChartData())
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <div>
            <h2>COVID-19 DATA - NEW ZEALAND</h2>
          </div>
          <div className="navigation">
            <button value="annotation"
                    disabled={this.state.chosenChartType === "annotation"}
                    onClick={e => this.toggleChartType(e)}>CASE TIMELINE</button>
            <button value="bar"
                    disabled={this.state.chosenChartType === "bar"}
                    onClick={e => this.toggleChartType(e)}>CASES BY REGION</button>
            <button value="geochart"
                    disabled={this.state.chosenChartType === "geochart"}
                    onClick={e => this.toggleChartType(e)}>MAP</button>
          </div>
        </div>
        { this.state.apiSummaryData !== null && this.state.googleChartData.length > 0 ?
          <div className="site-content">
            <GoogleChart data={this.state.googleChartData}
                         chartType={this.state.chosenChartType}
                         numberType={this.state.chosenNumberType}
                         toggleNumberType={this.toggleNumberType}
                         toggleCaseType={this.toggleCaseType} />
            <SummaryData data={this.state.apiSummaryData}
                         chartData={this.state.dhbChartData} />
          </div>
        : <div className="loader"><img src={require('../images/Rolling-1.2s-100px.gif')} /></div> }
      </div>
    );
  }
}

export default App;
