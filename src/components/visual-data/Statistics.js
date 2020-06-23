import React, { Component } from 'react'
import Chart from 'react-google-charts'

import { 
  getAgeGroupData, 
  getSexData,
  getDHBData,
  getTestingData
} from '../../helpers/pie-coordinates'

const initialChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'

class Statistics extends Component {

  constructor(props) {
    super(props)
    var currentChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'
    var currentScreenWidth = (window.screen.width < 565) ? 'smallest' : 
                             (window.screen.width >= 565 && window.screen.width < 1010) ? 'smaller' : 
                             'larger'
    var totalCases = props.caseData.confirmed.concat(props.caseData.probable)
    this.state = {
      allCases: totalCases,
      chartData: getDHBData(totalCases),
      selectedData: 'DHB Total Cases',
      selectedCaseType: 'total',
      showDataSelector: false,
      showTotalCasesSelector: true,
      showTestingSelector: true,
      chartHeight: (currentChartOrientation === 'landscape' && currentScreenWidth === 'larger') ? '80vh' : 
                   ((currentChartOrientation === 'portrait' && currentScreenWidth === 'larger') || currentScreenWidth === 'smaller') ? '60vh' : 
                   '55vh',
      prevChartOrientation: initialChartOrientation,
      prevScreenWidth: (window.screen.width < 565) ? 'smallest' : 
                       (window.screen.width >= 565 && window.screen.width < 1010) ? 'smaller' : 
                       'larger'
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.forceChartResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.forceChartResize)
  }

  forceChartResize = () => {
    var currentChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'
    var currentScreenWidth = (window.screen.width < 565) ? 'smallest' : 
                             (window.screen.width >= 565 && window.screen.width < 1010) ? 'smaller' : 
                             'larger'
    // If screen orientation change OR screen size threshold change, redraw chart
    if (this.state.prevChartOrientation !== currentChartOrientation || this.state.prevScreenWidth !== currentScreenWidth) {
      this.forceChartRedraw()
    }
  }

  forceChartRedraw = () => {
    var currentChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'
    var currentScreenWidth = (window.screen.width < 565) ? 'smallest' : 
                             (window.screen.width >= 565 && window.screen.width < 1010) ? 'smaller' : 
                             'larger'
    // If screen orientation = landscape AND screen width >= 1010px, set chart height to 80vh 
    // Else if screen width >= 565px and < 1010px, set chart height to 60vh 
    // Else set chart height to 55vh
    // Update chart orientation and chart width if they have changed
    this.setState({
      chartHeight: (currentChartOrientation === 'landscape' && currentScreenWidth === 'larger') ? '80vh' : 
                    ((currentChartOrientation === 'portrait' && currentScreenWidth === 'larger') || 
                    currentScreenWidth === 'smaller') ? '60vh' : '55vh',
      prevChartOrientation: this.state.prevChartOrientation !== currentChartOrientation ? currentChartOrientation : this.state.prevChartOrientation,
      prevScreenWidth: this.state.prevScreenWidth !== currentScreenWidth ? currentScreenWidth : this.state.prevScreenWidth
    }, () => {
      document.querySelector('.pie-chart > div').style.height = this.state.chartHeight
      document.querySelector('.pie-chart > div > div').style.height = this.state.chartHeight
      if (this.chartWrapper) this.chartWrapper.draw()
      this.forceUpdate()
    })
  }

  render() {
    return (
      <div className="statistics" 
           style={{ gridTemplateRows: (this.state.showDataSelector && window.screen.width < 565) && 'min-content auto'}}>
        <input type="checkbox" 
               onClick={() => this.setState({ showDataSelector: !this.state.showDataSelector })}></input>
        <div className="data-selector-toggle">
          <p><i className="arrow"></i></p>
        </div>
        <div className="pie-chart">
          <Chart
            chartType="PieChart"
            getChartWrapper={chartWrapper => this.chartWrapper = chartWrapper}
            loader={<div>Loading Chart...</div>}
            data={[
              ['Grouping', 'Number of cases'],
              ...this.state.chartData
            ]}
            options={{
              height: this.state.chartHeight,
              backgroundColor: { fill: 'black' },
              fontName: 'Quicksand',
              pieSliceText: 'value',
              chartArea: {
                height: '80%',
                width: '95%',
                bottom: 30,
                backgroundColor: 'black'
              },
              legend: {
                position: 'top',
                maxLines: 3,
                textStyle: {
                  color: 'white',
                  fontSize: (window.screen.width < 565) ? 8 : (window.screen.width < 1010) ? 10 : 12,
                  textTransform: 'uppercase'
                },
                pagingTextStyle: { color: 'white'},
                scrollArrows: {
                  activeColor: 'white',
                  inactiveColor: 'white'
                }
              },
              is3D: true
            }}
          />
        </div>
        <div className="data-selector-wrapper">
          <div className="total-cases-data-selector">
            <div className="data-selector-button" onClick={() => this.setState({ showTotalCasesSelector: !this.state.showTotalCasesSelector })}>
              <p><i className={`arrow ${this.state.showTotalCasesSelector ? 'down' : 'right'}`}></i></p>
              <span>TOTAL CASE STATISTICS</span>
            </div>
            { this.state.showTotalCasesSelector &&
              <div className="data-selector">
                <div className={`statistic-type ${this.state.selectedData === 'DHB Total Cases' && 'active'}`}
                      onClick={() => this.setState({
                        chartData: getDHBData(this.state.allCases),
                        selectedData: 'DHB Total Cases'
                      })}>
                  <img className="statistic-icon"
                        alt="age-icon"
                        src={require('../../images/icons/dhb.png')}/>
                  <span>DISTRICT HEALTH BOARD</span>
                </div>
                <div className={`statistic-type ${this.state.selectedData === 'Age Group Total Cases' && 'active'}`}
                     onClick={() => this.setState({
                        chartData: getAgeGroupData(this.props.ageGroupData, this.state.selectedCaseType),
                        selectedData: 'Age Group Total Cases'
                     })}>
                  <img className="statistic-icon"
                        alt="age-icon"
                        src={require('../../images/icons/age.png')}/>
                  <span>AGE</span>
                </div>
                <div className={`statistic-type ${this.state.selectedData === 'Sex Total Cases' && 'active'}`}
                     onClick={() => this.setState({
                        chartData: getSexData(this.state.allCases),
                        selectedData: 'Sex Total Cases'
                     })}>
                  <img className="statistic-icon"
                        alt="gender-icon"
                        src={require('../../images/icons/gender.png')}/>
                  <span>SEX</span>
                </div>
              </div>
            }
          </div>
          <div className="testing-data-selector">
            <div className="data-selector-button" onClick={() => this.setState({ showTestingSelector: !this.state.showTestingSelector })}>
              <p><i className={`arrow ${this.state.showTestingSelector ? 'down' : 'right'}`}></i></p>
              <span>TESTING STATISTICS</span>
            </div>
            { this.state.showTestingSelector &&
              <>
                <div className="data-selector-subcategory">POSITIVE TEST RATE</div>
                <div className="data-selector">
                  <div className={`statistic-type ${this.state.selectedData === 'DHB Testing Rates' && 'active'}`}
                      onClick={() => this.setState({
                          chartData: getTestingData(this.props.testingData.dhbData, 'positiveTestRate'),
                          selectedData: 'DHB Testing Rates'
                      })}>
                    <img className="statistic-icon"
                        alt="age-icon"
                        src={require('../../images/icons/dhb.png')}/>
                    <span>DISTRICT HEALTH BOARD</span>
                  </div>
                  <div className={`statistic-type ${this.state.selectedData === 'Ethnicity Testing Rates' && 'active'}`}
                      onClick={() => this.setState({
                          chartData: getTestingData(this.props.testingData.ethnicityData, 'positiveTestRate'),
                          selectedData: 'Ethnicity Testing Rates'
                      })}>
                    <img className="statistic-icon"
                        alt="planet-earth-icon"
                        src={require('../../images/icons/planet-earth.png')}/>
                    <span>ETHNICITY</span>
                  </div>
                </div>
                <div className="data-selector-subcategory">TOTAL PEOPLE TESTED</div>
                <div className="data-selector">
                  <div className={`statistic-type ${this.state.selectedData === 'DHB Total People Tested' && 'active'}`}
                      onClick={() => this.setState({
                          chartData: getTestingData(this.props.testingData.dhbData, 'totalPeopleTested'),
                          selectedData: 'DHB Total People Tested'
                      })}>
                    <img className="statistic-icon"
                        alt="age-icon"
                        src={require('../../images/icons/dhb.png')}/>
                    <span>DISTRICT HEALTH BOARD</span>
                  </div>
                  <div className={`statistic-type ${this.state.selectedData === 'Ethnicity Total People Tested' && 'active'}`}
                      onClick={() => this.setState({
                          chartData: getTestingData(this.props.testingData.ethnicityData, 'totalPeopleTested'),
                          selectedData: 'Ethnicity Total People Tested'
                      })}>
                    <img className="statistic-icon"
                        alt="planet-earth-icon"
                        src={require('../../images/icons/planet-earth.png')}/>
                    <span>ETHNICITY</span>
                  </div>
                </div>
              </>
            } 
          </div>
        </div>
      </div>
    )
  }
}

export default Statistics
