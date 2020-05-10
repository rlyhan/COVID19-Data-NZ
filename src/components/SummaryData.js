import React, { Component } from 'react'

import { convertDateToString } from '../helpers/dates'

class SummaryData extends Component {

  formatCount = (num, type) => {
    // Make count string with CASES/CASE/NO CASES depending on number
    return (num > 1) ? `${num} ${type} CASES` :
           (num === 1) ? `${num} ${type} CASE` :
           `NO ${type} CASES`
  }

  formatCountIncrease = num => {
    // Add plus or minus in front of count string
    if (Math.sign(num) === -1) return `${num.toLocaleString('en')} `
    else if (Math.sign(num) === 1) return `+${num.toLocaleString('en')} `
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
    const newCases = (confirmedCases.newInLast24Hr > 0 ? confirmedCases.newInLast24Hr : 0) + (probableCases.newInLast24Hr > 0 ? probableCases.newInLast24Hr : 0)
    const { dhbData, testingData } = this.props
    const activeCases = Object.keys(dhbData).reduce(function(total, name) { return total + parseInt(dhbData[name].active)}, 0)

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
              <div className="active-cases">
                <p>
                  <span>
                    <img className="active-cases-icon"
                         alt="active-cases-icon"
                         src={require('../images/icons/active-cases.png')}/>
                  </span>
                  <span>{this.formatCount(activeCases, 'ACTIVE')}</span>
                </p>
              </div>
              <div className="new-info">
                <p>
                  {
                    <>
                      <span>
                        <img className="new-case-arrow"
                             alt="new-case-arrow"
                             style={{transform: newCases > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                             src={require('../images/icons/new-case-arrow.png')}/>
                      </span>
                      <span>{this.formatCount(newCases, 'NEW')}</span>
                    </>
                  }
                </p>
              <ul>
                  {
                    confirmedCases.newInLast24Hr > 0 &&
                    <li>
                      {`${confirmedCases.newInLast24Hr} ${confirmedCases.newInLast24Hr > 1 ? 'cases' : 'case'} updated as confirmed`}
                    </li>
                  }
                  {
                    probableCases.newInLast24Hr > 0 &&
                    <li>{`${probableCases.newInLast24Hr} ${probableCases.newInLast24Hr > 1 ? 'cases' : 'case'} recorded as probable`}</li>
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="stat-container">
              <div className="label">
                <span>
                  <img alt="recovered" src={require('../images/icons/recovered.png')} />
                </span>
                <span>RECOVERED</span>
              </div>
              <div className="count">
                <span>{`${recoveredCases.totalToDate.toLocaleString('en')}`}</span>
                {
                  recoveredCases.newInLast24Hr !== 0 ?
                  <span>
                    <span>{this.formatCountIncrease(recoveredCases.newInLast24Hr)}</span>
                    <img className="change-arrow"
                         alt="change-arrow"
                         style={{transform: recoveredCases.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                         src={require('../images/icons/recovered-arrow.png')}/>
                  </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
                }
              </div>
            </div>
            <div className="stat-container">
              <div className="label">
                <span>
                  <img alt="dead" src={require('../images/icons/dead.png')} />
                </span>
                <span>DEAD</span>
              </div>
              <div className="count">
              <span>{`${deaths.totalToDate.toLocaleString('en')}`}</span>
              {
                deaths.newInLast24Hr !== 0 ?
                <span>
                  <span>{this.formatCountIncrease(deaths.newInLast24Hr)}</span>
                  <img className="change-arrow"
                       alt="change-arrow"
                       style={{transform: deaths.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                       src={require('../images/icons/dead-arrow.png')}/>
                </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
              }
              </div>
            </div>
            <div className="stat-container">
              <div className="label">
                <span>
                  <img alt="hospital" src={require('../images/icons/hospital.png')} />
                </span>
                <span>CURRENTLY IN HOSPITAL</span>
              </div>
              <div className="count">
                <span>{`${hospitalCases.totalToDate.toLocaleString('en')}`}</span>
                {
                  hospitalCases.newInLast24Hr !== 0 ?
                  <span>
                    <span>{this.formatCountIncrease(hospitalCases.newInLast24Hr)}</span>
                    <img className="change-arrow"
                         alt="change-arrow"
                         style={{transform: hospitalCases.newInLast24Hr > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                         src={require('../images/icons/hospital-arrow.png')}/>
                  </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
                }
              </div>
            </div>
            <div className="stat-container">
              <div className="label">
                <span>
                  <img alt="test" src={require('../images/icons/test.png')} />
                </span>
                <span>TESTS TO DATE</span>
              </div>
              <div className="count">
                <span>{`${testingData.totalToDate.testCount.toLocaleString('en')}`}</span>
                {
                  testingData.totalToDate.testCount !== 0 ?
                  <span>
                    <span>{this.formatCountIncrease(testingData.testedYesterday.testCount)}</span>
                    <img className="change-arrow"
                         alt="change-arrow"
                         style={{transform: testingData.testedYesterday.testCount > 0 ? 'rotate(180deg)' : 'rotate(0deg)'}}
                         src={require('../images/icons/test-arrow.png')}/>
                  </span> : <span style={{fontSize: '0.57em'}}>NO CHANGE</span>
                }
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="footer-container">
              <p style={{fontSize: '1.3em'}}>CREDITS</p>
              <p>
                DATA SOURCE:&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases">
                MINISTRY OF HEALTH</a>.
              </p>
              <p>
                DISTRICT HEALTH BOARD MAPPING:&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://datafinder.stats.govt.nz/layer/87883-district-health-board-2015">
                STATS NZ</a>.
              </p>
              <p style={{marginBottom: '13px'}}>
                ICONS MADE BY FREEPIK FROM <a target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com">FLATICON</a>.
              </p>
              <p style={{fontSize: '1.3em'}}>PLEASE NOTE</p>
              <p>
                {`GRAPH IS CURRENTLY SHOWING DATA UP TO DATE OF LATEST CASE: ${convertDateToString(this.props.chartDate, 'text').toUpperCase()}.`}
              </p>
              <p style={{marginBottom: 0}}>
                THIS SITE IS NOT AN OFFICIAL DATA SOURCE. NEW DATA USUALLY UPDATED AFTER 1PM.
              </p>
            </div>
          </div>
        </div>
      }
      </>
    )
  }

}

export default SummaryData
