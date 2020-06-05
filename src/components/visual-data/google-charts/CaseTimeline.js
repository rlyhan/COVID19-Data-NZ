import React, { Component } from 'react'
import Chart from 'react-google-charts'

const initialChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'

class CaseTimeline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chartHeight: (window.screen.width > window.screen.height) ? 'calc(80vh - 65px)' : '60vh',
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
      // If landscape, chart height 80vh minus height of filter box
      // If portrait, chart height 60vh
    var currentChartOrientation = (window.screen.width > window.screen.height) ? 'landscape' : 'portrait'
    if (this.state.prevChartOrientation !== currentChartOrientation) {
      this.setState({
        chartHeight: (window.screen.width > window.screen.height) ? 'calc(80vh - 65px)' : '60vh',
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
        <div style={{height: (window.screen.width > window.screen.height) ? 'calc(80vh - 65px)' : '60vh', position: 'relative'}}>
          <div className="loader">
            <img alt="loading"
                src={require('../../../images/Rolling-1.2s-100px.gif')} />
          </div>
        </div> :
        this.props.data === null ?
        <div>Could not fetch data. Please try again.</div> :
        <> { this._isMounted &&
          <div className="line-chart">
            <Chart
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              getChartWrapper={chartWrapper => this.chartWrapper = chartWrapper}
              rows={this.props.data}
              columns={[
                {
                  type: "date",
                  role: "domain",
                  label: "DATE"
                },
                {
                  type: "number",
                  role: "data",
                  label: this.props.numberType === "total" ? `TOTAL ${this.props.caseType.toUpperCase()} COVID-19 CASES TO THIS DAY` :
                                                        `NEW ${this.props.caseType.toUpperCase()} COVID-19 CASES RECORDED ON THIS DAY`
                },
                {
                  type: "string", 
                  role: "tooltip", 
                  p: {html: true},
                  label: "Event"
                },
                {
                  type: "string", 
                  role: "annotation",
                  p: {html: true}
                }
              ]}
              chartEvents={[
                {
                  eventName: "ready",
                  callback: ({ chartWrapper, google }) => {
                    const chart = chartWrapper.getChart()
                    // Selects the point at clicked event's respective date
                    if (this.props.selectedEvent) {
                      var eventIndex = this.props.data.findIndex(coord => coord[3] === this.props.selectedEvent)
                      chart.setSelection([{ row: eventIndex, column: 1 }])
                    }
                    // Move the range control below graph
                    if (document.querySelector("[id^='googlechart-control-']")) {
                      var dateRangeControl = document.querySelector("[id^='googlechart-control-']")
                      document.querySelector('.google-range-filter').appendChild(dateRangeControl)
                    }
                  }
                }
              ]}
              controls={[
                {
                  controlType: 'DateRangeFilter',
                  options: {
                    filterColumnLabel: 'DATE',
                    ui: { format: { pattern: 'dd/MM/YYY' } },
                  },
                },
              ]}
              options={{
                height: this.state.chartHeight,
                backgroundColor: {
                  fill: 'black'
                },
                animation: {
                  startup: true,
                  easing: 'in',
                  duration: 100
                },
                tooltip: {
                  isHtml: true,
                  trigger: 'selection'
                },
                legend: {
                  alignment: 'start',
                  position: 'top',
                  textStyle: {
                    color: 'white',
                    fontName: 'Quicksand',
                    fontSize: 11
                  }
                },
                hAxis: {
                  textStyle: {
                    color: 'white',
                    fontName: 'Quicksand',
                    fontSize: 12,
                    textTransform: 'uppercase'
                  },
                  gridlines: {
                    color: '#525252'
                  }
                },
                vAxis: {
                  gridlines: {
                    color: '#525252'
                  }
                },
                chartArea: {
                  height: '100%',
                  width: '100%',
                  top: 20,
                  left: 30,
                  right: 5,
                  bottom: 30,
                  backgroundColor: 'black',
                },
                annotations: {
                  boxStyle: {
                    fill: '#1e1e1e',
                    rx: 5,
                    ry: 5,
                    gradient: {
                      color1: '#343434',
                      color2: '#151515',
                      x1: '0%', y1: '0%',
                      x2: '100%', y2: '100%',
                      useObjectBoundingBoxUnits: true
                    }
                  },
                  textStyle: {
                    color: 'white',
                    auraColor: 'transparent',
                    fontName: 'Quicksand',
                    fontSize: 16
                  }
                },
                thickness: '1.5'
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </div>
        } </> }
      </>
    )
  }
}

export default CaseTimeline
