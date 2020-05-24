import React, { Component } from 'react'
import SummaryData from './SummaryData'
import Mapbox from './visual-data/Mapbox'
import GoogleChart from './visual-data/GoogleChart'
import { fetchCurrentData, fetchCases } from '../api/covid-data'
import { getLineCoordinates } from '../helpers/coordinates'
import { firstConfirmedCaseDay, findNearestDateToToday } from '../helpers/dates'

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
      chosenVisualType: "map", // Tells which chart to show on page, ie. MAP / CASE TIMELINE
      chosenCaseType: "confirmed and probable", // Tells whether to get CONFIRMED + PROBABLE / CONFIRMED ONLY cases
      chosenNumberType: "new" // Tells which co-ordinates to get, ie. TOTAL or NEW
    }
  }

  componentDidMount() {
    // Fetch current summary, DHB, and testing data from API
    fetchCurrentData()
      .then(data => {
        var { summaryData, dhbData, testingData } = data
        if (summaryData.error || dhbData.error || testingData.error) {
          console.log('Could not fetch summary data')
          this.setState({ invalidDataError: true })
        }
        else {
          this.setState({
            apiSummaryData: summaryData,
            apiDHBData: dhbData,
            apiTestingData: testingData
          })
        }
      })
      .catch(e => {
        this.setState({ invalidDataError: true })
      })
    // Fetch detailed individual case data from API
      // Get coordinates for charts
      // Initially shows ALL CASES ie. CONFIRMED + PROBABLE CASES / TOTAL NO. CASES
    fetchCases()
      .then(data => {
        if (data.error) {
          console.log('Could not fetch case data')
          this.setState({ invalidDataError: true })
        }
        else {
          this.setState({ apiCaseData: data }, () => {
            this.setState({ chartDate: new Date(findNearestDateToToday(this.getAllCases())) }, () => {
              this.setChartData()
              // this.setState({ dhbChartData: getBarCoordinates(this.getAllCases()) })
            })
          })
        }
      })
      .catch(e => {
        this.setState({ invalidDataError: true })
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
    if (this.state.chosenCaseType === "confirmed and probable") return this.getAllCases()
    else if (this.state.chosenCaseType === "confirmed") return this.getConfirmedCases()
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
            googleChartData: getLineCoordinates(this.state.chosenCaseSet, firstConfirmedCaseDay, this.state.chartDate, this.state.chosenNumberType)
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
            <h2>COVID-19 DATA - NEW ZEALAND</h2>
          </div>
          <div className="maintenance">WEBSITE UNDER MAINTENANCE. PLEASE CHECK AGAIN SOON!</div>
        </div> :
        this.state.apiSummaryData !== null && this.state.apiDHBData !== null &&
        this.state.apiTestingData != null && this.state.apiCaseData != null?
        <div className="App">
          <div className="header-wrapper">
            <input type="checkbox" id="toggle"/>
            <div className="hamburger-menu">
              <div id="burger">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="header">
              <h2>COVID-19 DATA - NEW ZEALAND</h2>
            </div>
            <div className="navigation">
              <div>
                <button value="map"
                        disabled={this.state.chosenVisualType === "map"}
                        onClick={e => this.toggleChartType(e)}>MAP</button>
              </div>
              <div>
                <button value="case timeline"
                        disabled={this.state.chosenVisualType === "case timeline"}
                        onClick={e => this.toggleChartType(e)}>CASE TIMELINE</button>
              </div>
              {/*<button value="bar"
                      disabled={this.state.chosenVisualType === "bar"}
                      onClick={e => this.toggleChartType(e)}>STATISTICS</button>*/}
            </div>
          </div>
          <div className="site-content">
            <div className="visual-data-wrapper">
              <div className="visual-data">
                {
                  this.state.chosenVisualType === 'map' ?
                  <Mapbox data={this.state.apiDHBData} /> :
                  <GoogleChart googleChartData={this.state.googleChartData}
                               dhbData={this.state.apiDHBData}
                               visualType={this.state.chosenVisualType}
                               caseType={this.state.chosenCaseType}
                               numberType={this.state.chosenNumberType}
                               toggleNumberType={this.toggleNumberType}
                               toggleCaseType={this.toggleCaseType} />
                }
              </div>
            </div>
            <div className="sidebar-wrapper">
              <SummaryData summaryData={this.state.apiSummaryData}
                           dhbData={this.state.apiDHBData}
                           testingData={this.state.apiTestingData}
                           chartDate={this.state.chartDate} />
            </div>
          </div>
        </div>
      : <div className="loader">
          <img alt="loading" src={require('../images/Rolling-1.2s-100px.gif')} />
        </div> }
      </>
    );
  }
}

export default App;
