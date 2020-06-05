import React, { Component } from 'react'
import Chart from 'react-google-charts'

// If landscape, chart height 80vh minus height of filter box
// If portrait, chart height 60vh
const initialChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'

class Statistics extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chartHeight: (window.screen.width > window.screen.height) ? '80' : '60',
      prevChartOrientation: initialChartOrientation
    }
  }

  componentDidMount() {
    this._isMounted = true
    window.addEventListener('resize', this.forceChartResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.forceChartResize)
    this._isMounted = false
  }

  forceChartResize = () => {
    // Force update on component upon resize to force chart redraw
    var currentChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'
    if (this.state.prevChartOrientation !== currentChartOrientation) {
      this.setState({
        chartHeight: (window.screen.width > window.screen.height) ? '80' : '60',
        prevChartOrientation: currentChartOrientation
      }, () => {
        this.forceUpdate()
      })
    }
  }

  render() {
    return (
      <>
      { this.props.data === [] ?
        <div style={{height: (window.screen.width > window.screen.height) ? '80vh' : '60vh', position: 'relative'}}>
          <div className="loader">
            <img alt="loading"
                src={require('../../images/Rolling-1.2s-100px.gif')} />
          </div>
        </div> :
        this.props.data === null ?
        <div>Could not fetch data. Please try again.</div> :
        <> { this._isMounted &&
          <div className="statistics">
            <div className="pie-chart">
              <Chart
                  chartType="PieChart"
                  loader={<div>Loading Chart...</div>}
                  data={[
                      ['Task', 'Hours per Day'],
                      ['Work', 11],
                      ['Eat', 2],
                      ['Commute', 2],
                      ['Watch TV', 2],
                      ['Sleep', 7],
                  ]}
                  options={{
                    height: `calc(${this.state.chartHeight}vh - 2px)`,
                    backgroundColor: {
                      fill: 'black'
                    },
                    chartArea: {
                      backgroundColor: 'black'
                    },
                    is3D: true
                  }}
              />
            </div>
            <div className="data-selector">
              <div className="statistic-type">
                <span>AGE</span>
              </div>
              <div className="statistic-type">
                <span>GENDER</span>
              </div>
              <div className="statistic-type">
                <span>ETHNICITY</span>
              </div>
            </div>
          </div>
        } </> }
      </>
    )
  }
}

export default Statistics
