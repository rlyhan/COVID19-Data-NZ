import React, { Component } from 'react'
import Chart from 'react-google-charts'

class GoogleChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coordinates: []
    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    // console.log(this.props.data)
    // this.setState({ coordinates: this.props.data })
  }

  render() {
    return (
      <>
      { this.props.data === [] ?
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
              label: "New cases"
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
          options={{
            width: '600px',
            height: '400px',
            chartArea: {
              backgroundColor: 'black'
            }
          }}
          rootProps={{ 'data-testid': '2' }}
        />
      }
      </>
    );
  }

}

export default GoogleChart
