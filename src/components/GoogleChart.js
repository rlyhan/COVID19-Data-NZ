import React, { Component } from 'react'
import Chart from 'react-google-charts'

class GoogleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coords: []
    }
  }

  componentDidMount() {
    // if (this.chartWrapper) {
    //   window.addEventListener('resize', this.drawChart, {capture: true})
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      console.log("Passed to chart:", this.props.data)
    }
  }

  setHeight = () => {
    return document.querySelector('.google-chart-wrapper').offsetWidth * 0.85
  }

  toggle = e => {

  }

  render() {
    return (
      <div className="google-chart-wrapper">
        <div className="google-chart">
        {this.props.data === [] ?
          <div>Loading...</div> :
          this.props.data === null ?
          <div>Could not fetch data. Please try again.</div> :
          <Chart
            chartType="AnnotationChart"
            loader={<div>Loading Chart...</div>}
            rows={this.props.data}
            columns={[
              {
                type: "date",
                label: "Date"
              },
              {
                type: "number",
                label: "New COVID-19 cases recorded on this day"
              },
              {
                type: "string",
                label: "Event"
              },
              {
                type: "string",
                label: "Event description"
              }
            ]}
            chartEvents={[
              {
                eventName: 'animationfinish',
                callback: () => {
                  console.log('Animation Finished')
                },
              },
            ]}
            getChartWrapper={chartWrapper => {
        			this.chartWrapper = chartWrapper
              chartWrapper.draw();
            }}
            options={{
              displayAnnotations: true,
              displayZoomButtons: false,
              width: '100%',
              height: '300px',
              // height: '50vh',
              chart: {
                backgroundColor: 'black',
                hAxis: {
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
                  backgroundColor: 'black',
                }
              },
              annotationsWidth: 25,
              thickness: '2'
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        }
        </div>
        <div className="toggle-menu">
          <select onChange={this.props.toggleCaseType.bind(this)}>
            <option value="both">CONFIRMED + PROBABLE CASES</option>
            <option value="confirmed">CONFIRMED CASES ONLY</option>
          </select>
        </div>
      </div>
    );
  }

}

export default GoogleChart
