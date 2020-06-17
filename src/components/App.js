import React, { Component } from 'react'
import SummaryData from './SummaryData'
import Mapbox from './visual-data/Mapbox'
import Timeline from './visual-data/Timeline'
import Statistics from './visual-data/Statistics'
import { fetchCurrentData } from '../api/current-data'
import { fetchTestingData } from '../api/testing-data'
import { fetchCases } from '../api/case-data'

class App extends Component {

  constructor() {
    super()
    this.state = {
      invalidDataError: false,
      apiCurrentData: null,
      apiTestingData: null,
      apiCaseData: null,
      chartDate: null,
      chosenVisualType: "map", // Tells which chart to show on page, ie. MAP / CASE TIMELINE
    }
  }

  componentDidMount() {
    // Fetch current summary, DHB, and testing data from API
    fetchCurrentData()
      .then(data => {
        var { 
          summaryData, 
          dhbData, 
          ageGroupData, 
          testingData 
        } = data
        if (summaryData.error || dhbData.error || ageGroupData.error || testingData.error) {
          console.log('Could not fetch summary data')
          this.setState({ invalidDataError: true })
        }
        else this.setState({ apiCurrentData: data })
      })
      .catch(e => {
        this.setState({ invalidDataError: true })
      })
    // Fetch testing rate data 
    fetchTestingData()
      .then(data => {
        var {
          dhbData
        } = data
        if (dhbData.error) {
          console.log('Could not fetch testing data')
          this.setState({ invalidDataError: true })
        }
        else this.setState({ apiTestingData: data })
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
        else this.setState({ apiCaseData: data })
      })
      .catch(e => {
        this.setState({ invalidDataError: true })
      })
  }

  // Toggle which chart to show
  toggleChartType = e => {
    e.preventDefault()
    this.setState({ chosenVisualType: e.target.value })
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
        this.state.apiCurrentData !== null && this.state.apiTestingData !== null && this.state.apiCaseData !== null?
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
                <button value="timeline"
                        disabled={this.state.chosenVisualType === "timeline"}
                        onClick={e => this.toggleChartType(e)}>TIMELINE</button>
              </div>
              <div>
                <button value="statistics"
                        disabled={this.state.chosenVisualType === "statistics"}
                        onClick={e => this.toggleChartType(e)}>STATISTICS</button>
              </div>
            </div>
          </div>
          <div className="site-content">
            <div className="visual-data-wrapper">
              <div className="visual-data">
                {
                  this.state.chosenVisualType === 'map' ?
                  <Mapbox data={this.state.apiCurrentData.dhbData} /> :
                  this.state.chosenVisualType === 'timeline' ?
                  <Timeline apiCaseData={this.state.apiCaseData} /> :
                  this.state.chosenVisualType === 'statistics' ?
                  <Statistics ageGroupData={this.state.apiCurrentData.ageGroupData}
                              testingData={this.state.apiTestingData}
                              caseData={this.state.apiCaseData} 
                  /> : null
                }
              </div>
            </div>
            <div className="sidebar-wrapper">
              <SummaryData summaryData={this.state.apiCurrentData.summaryData}
                           dhbData={this.state.apiCurrentData.dhbData}
                           testingData={this.state.apiCurrentData.testingData} />
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
