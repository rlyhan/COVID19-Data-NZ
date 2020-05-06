import React, { Component } from 'react'

import BarChart from './Charts/BarChart'
import { convertDateToString } from '../helpers/dates'

class SummaryData extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coordinates: []
    }
  }

  componentDidMount() {
    console.log(this.props.summaryData)
  }

  componentDidUpdate() {
    // this.setState({ coordinates: this.props.summaryData })
  }

  formatCountIncrease = num => {
    // If over 1000, convert to 'K' format
    // If over 1,000,000, convert to 'M' format
    var countString = num
    // if (num > 10000) {
    //   num = (num * 0.001).toFixed(1)
    //   countString = `${num}K`
    // }
    // Add plus or minus in front of count
    switch(Math.sign(num)) {
      case -1:
        return `${countString.toLocaleString('en')} `
      case 1:
        return `+${countString.toLocaleString('en')} `
    }
  }

  render() {
    const {
      confirmedCases,
      probableCases,
      confirmedAndProbableCases,
      recoveredCases,
      deaths,
      hospitalCases
    } = this.props.summaryData
    const { testingData } = this.props

    return (
      <>
      { this.props.summaryData && this.props.testingData && this.props.chartDate &&
        <div className="summary-data">
          <div className="total-cases">
            <div className="total-cases-container">
              <div className="total-case-number">
                <p>
                  {'TOTAL COVID-19 CASES NATIONWIDE: '}
                  <span style={{color: 'white'}}>{confirmedAndProbableCases.totalToDate.toLocaleString('en')}</span>
                </p>
                <p>{`${confirmedCases.totalToDate.toLocaleString('en')} CONFIRMED / ${probableCases.totalToDate.toLocaleString('en')} PROBABLE`}</p>
              </div>
              <div className="new-info">
                <p>
                  {
                    confirmedAndProbableCases.newInLast24Hr != 0 ?
                    <>
                      <span>
                        <img className="new-case-arrow"
                             style={{transform: confirmedAndProbableCases.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                             src={require('../images/icons/new-case-arrow.png')}/>
                      </span>
                      <span>
                      {
                        confirmedAndProbableCases.newInLast24Hr >= 1 ?
                        ` ${confirmedAndProbableCases.newInLast24Hr} NEW CASES` : ` NO NEW CASES (${confirmedAndProbableCases.newInLast24Hr})`
                      }
                      </span>
                    </> :
                    <span>NO NEW CASES</span>
                  }
                </p>
                <ul>
                  {
                    confirmedCases.newInLast24Hr > 0 &&
                    <li>{`${confirmedCases.newInLast24Hr} case(s) classified as confirmed`}</li>
                  }
                  {
                    probableCases.newInLast24Hr > 0 &&
                    <li>{`${probableCases.newInLast24Hr} case(s) recorded as probable`}</li>
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="stat-container">
              <div className="label">
                <span>
                  <img src={require('../images/icons/recovered.png')} />
                </span>
                <span>RECOVERED</span>
              </div>
              <div className="count">
                <span>{`${recoveredCases.totalToDate.toLocaleString('en')}`}</span>
                {
                  recoveredCases.newInLast24Hr != 0 ?
                  <span>
                    <span>{this.formatCountIncrease(recoveredCases.newInLast24Hr)}</span>
                    <img className="change-arrow"
                         style={{transform: recoveredCases.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                         src={require('../images/icons/recovered-arrow.png')}/>
                  </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
                }
              </div>
            </div>
            <div className="stat-container">
              <div className="label">
                <span>
                  <img src={require('../images/icons/dead.png')} />
                </span>
                <span>DEAD</span>
              </div>
              <div className="count">
              <span>{`${deaths.totalToDate.toLocaleString('en')}`}</span>
              {
                deaths.newInLast24Hr != 0 ?
                <span>
                  <span>{this.formatCountIncrease(deaths.newInLast24Hr)}</span>
                  <img className="change-arrow"
                       style={{transform: deaths.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                       src={require('../images/icons/dead-arrow.png')}/>
                </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
              }
              </div>
            </div>
            <div className="stat-container">
              <div className="label">
                <span>
                  <img src={require('../images/icons/hospital.png')} />
                </span>
                <span>CURRENTLY IN HOSPITAL</span>
              </div>
              <div className="count">
                <span>{`${hospitalCases.totalToDate.toLocaleString('en')}`}</span>
                {
                  hospitalCases.newInLast24Hr != 0 ?
                  <span>
                    <span>{this.formatCountIncrease(hospitalCases.newInLast24Hr)}</span>
                    <img className="change-arrow"
                         style={{transform: hospitalCases.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                         src={require('../images/icons/hospital-arrow.png')}/>
                  </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
                }
              </div>
            </div>
            <div className="stat-container">
              <div className="label">
                <span>
                  <img src={require('../images/icons/test.png')} />
                </span>
                <span>TESTS TO DATE</span>
              </div>
              <div className="count">
                <span>{`${testingData.totalToDate.testCount.toLocaleString('en')}`}</span>
                {
                  testingData.totalToDate.testCount != 0 ?
                  <span>
                    <span>
                      {
                        this.formatCountIncrease(47989)
                        // testingData.testedYesterday.testCount
                      }
                    </span>
                    <img className="change-arrow"
                         style={{transform: testingData.testedYesterday.testCount > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                         src={require('../images/icons/test-arrow.png')}/>
                  </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
                }
              </div>
            </div>
          </div>
          {/*<div className="calendar">
          </div>*/}
          <div className="footer">
            <div className="footer-container">
              <p style={{fontSize: '1.3em'}}>CREDITS</p>
              <p>
                DATA SOURCE:&nbsp;
                <a href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases">
                MINISTRY OF HEALTH</a>.
              </p>
              <p>
                DISTRICT HEALTH BOARD MAPPING:&nbsp;
                <a href="https://datafinder.stats.govt.nz/layer/87883-district-health-board-2015">
                STATS NZ</a>.
              </p>
              <p>
                ICONS MADE BY FREEPIK FROM <a href="https://www.flaticon.com">FLATICON</a>.
              </p>
              {/*<p>THE REGIONS ON THE MAP ARE DIVIDED INTO DISTRICT HEALTH BOARDS. MAPPING PROVIDED BY STATSNZ</p>*/}
              <p style={{fontSize: '1.3em'}}>PLEASE NOTE</p>
              <p>
                {`GRAPH SHOWING DATA UP TO ${convertDateToString(this.props.chartDate, 'text').toUpperCase()}.`}
              </p>
              <p style={{marginBottom: 0}}>THIS SITE IS NOT AN OFFICIAL DATA SOURCE AND MAY NOT BE UP TO DATE.</p>
            </div>
          </div>
          {/*Object.entries(this.state.summaryData).map(([key, value]) => {
            return <p>{`${key}: ${value.totalToDate}`}</p>
          })*/}
          {/*
          <div className="dhb-chart">
            <p style={{textAlign: 'center', fontSize: '0.7em'}}>CONFIRMED & PROBABLE CASES PER DISTRICT HEALTH BOARD</p>
              this.props.chartData && <BarChart data={this.props.chartData} />
          </div>
          */}
        </div>
      }
      </>
    )
  }

}

export default SummaryData
