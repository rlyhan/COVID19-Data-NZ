import React, { Component } from 'react';

import VisualData from './VisualData'
import SummaryData from './SummaryData'
import {
  fetchSummaryData,
  fetchSummaryDHBData,
  fetchSummaryTestingData,
  fetchCases
} from '../api/covid-data'
import { getAnnotationCoordinates, getBarCoordinates } from '../helpers/coordinates'
import { findNearestDateToToday } from '../helpers/dates'

const today = new Date()
const firstConfirmedCaseDay = new Date('2020-02-26')

class App extends Component {

  constructor() {
    super()
    this.state = {
      invalidDataError: false,
      apiSummaryData: null,
      apiDHBData: null,
      apiTestingData: null,
      apiCaseData: null,
      chartDate: null,
      googleChartData: [],
      chosenCaseSet: [],  // Array of selected cases to be sent as co-ords
      chosenVisualType: "map", // Tells which chart to show on page, ie. ANNOTATION / MAP
      chosenCaseType: "confirmed and probable", // Tells whether to get CONFIRMED + PROBABLE / CONFIRMED ONLY cases
      chosenNumberType: "new" // Tells which co-ordinates to get, ie. TOTAL or NEW
    }
  }

  componentDidMount() {
    // Fetch case summary data from API
    fetchSummaryData()
      .then(data => {
        if (data.error) this.setState({ invalidDataError: true })
        else this.setState({ apiSummaryData: data })
      })
    // Fetch summary DHB data from API
    fetchSummaryDHBData()
      .then(data => {
        if (data.error) this.setState({ invalidDataError: true })
        else this.setState({ apiDHBData: data })
      })
    // Fetch summary testing data from API
    fetchSummaryTestingData()
      .then(data => {
        if (data.error) this.setState({ invalidDataError: true })
        else this.setState({ apiTestingData: data })
        console.log(data)
      })
    // Fetch detailed individual case data from API
      // Get coordinates for charts
      // Initially shows ALL CASES ie. CONFIRMED + PROBABLE CASES / TOTAL NO. CASES
    fetchCases()
      .then(data => {
        if (data.error) this.setState({ invalidDataError: true })
        else {
          this.setState({ apiCaseData: data }, () => {
            this.setState({ chartDate: findNearestDateToToday(this.getAllCases()) }, () => {
              this.setChartData()
              // this.setState({ dhbChartData: getBarCoordinates(this.getAllCases()) })
            })
          })
        }
      })
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
      case "confirmed and probable":
        return this.getAllCases()
        break;
      case "confirmed":
        return this.getConfirmedCases()
        break;
    }
  }

  // Fetches coordinates for chart
  // 1. Initially have chosen case set in state (all or confirmed cases)
  // 2. Fetches coordinates based on chart type
  setChartData = () => {
    this.setState({
      chosenCaseSet: this.getCasesByType()
    }, () => {
      switch(this.state.chosenVisualType) {
        case "case timeline":
          this.setState({
            googleChartData: getAnnotationCoordinates(this.state.chosenCaseSet, firstConfirmedCaseDay, this.state.chartDate, this.state.chosenNumberType)
          })
          break;
        // case "bar":
        //   this.setState({
        //     googleChartData: getBarCoordinates(this.state.chosenCaseSet)
        //   })
        //   break;
        default:
          break;
      }
    })
  }

  // Toggle between getting TOTAL NO. CASES / NO. OF NEW CASES (for case timeline chart only)
  // Calls chart data setter
  toggleNumberType = e => {
    this.setState({ chosenNumberType: e.target.value }, () => this.setChartData())
  }

  // Toggles filtering of CONFIRMED + PROBABLE CASES / CONFIRMED CASES ONLY
  // Sets selected case type as a filter
  // Calls chart data setter
  toggleCaseType = e => {
    e.preventDefault()
    this.setState({ chosenCaseType: e.target.value }, () => this.setChartData())
  }

  // Toggle which chart to show
  toggleChartType = e => {
    e.preventDefault()
    this.setState({ chosenVisualType: e.target.value }, () => this.setChartData())
  }

  render() {
    return (
      <>
      { this.state.invalidDataError === true ?
        <div className="App">
          <div className="header">
            <div>
              <h2>COVID-19 DATA - NEW ZEALAND</h2>
            </div>
            <div className="maintenance">WEBSITE UNDER MAINTENANCE. PLEASE CHECK AGAIN SOON!</div>
          </div>
        </div> :
        this.state.apiSummaryData !== null && this.state.apiDHBData !== null &&
        this.state.apiTestingData != null && this.state.apiCaseData != null?
        <div className="App">
          <div className="header">
            <div>
              <h2>COVID-19 DATA - NEW ZEALAND</h2>
            </div>
            <div className="navigation">
              <button value="map"
                      disabled={this.state.chosenVisualType === "map"}
                      onClick={e => this.toggleChartType(e)}>MAP</button>
              <button value="case timeline"
                      disabled={this.state.chosenVisualType === "case timeline"}
                      onClick={e => this.toggleChartType(e)}>CASE TIMELINE</button>
              {/*<button value="bar"
                      disabled={this.state.chosenVisualType === "bar"}
                      onClick={e => this.toggleChartType(e)}>STATISTICS</button>*/}
            </div>
          </div>
          <div className="site-content">
          <div className="visual-data-wrapper">
            <VisualData googleChartData={this.state.googleChartData}
                        dhbData={this.state.apiDHBData}
                        visualType={this.state.chosenVisualType}
                        caseType={this.state.chosenCaseType}
                        numberType={this.state.chosenNumberType}
                        toggleNumberType={this.toggleNumberType}
                        toggleCaseType={this.toggleCaseType}
                        chartHeight={this.state.chartHeight} />
          </div>
            <div className="sidebar-wrapper">
              <SummaryData summaryData={this.state.apiSummaryData}
                           testingData={this.state.apiTestingData}
                           chartDate={this.state.chartDate} />
            </div>
          </div>
        </div>
      : <div className="loader">
          <img src={require('../images/Rolling-1.2s-100px.gif')} />
        </div> }
      </>
    );
  }
}

export default App;
