import React from 'react'
import Chart from 'react-google-charts'

// If landscape, chart height around 80vh
// If portrait, chart height 60vh
const chartHeight = (window.screen.width > window.screen.height) ? 'calc(80vh - 54px)' : '60vh'

const AnnotationChart = props => {
  return (
    <>
    { props.data === [] ?
      <div style={{height: chartHeight, position: 'relative'}}>
        <div className="loader">
          <img alt="loading"
               src={require('../../../images/Rolling-1.2s-100px.gif')} />
        </div>
      </div> :
      props.data === null ?
      <div>Could not fetch data. Please try again.</div> :
      <div className="google-chart">
        <Chart
          chartType="AnnotationChart"
          loader={<div>Loading Chart...</div>}
          rows={props.data}
          columns={[
            {
              type: "date",
              label: "Date"
            },
            {
              type: "number",
              label: props.numberType === "total" ? `TOTAL ${props.caseType.toUpperCase()} COVID-19 CASES TO THIS DAY` :
                                                    `NEW ${props.caseType.toUpperCase()} COVID-19 CASES RECORDED ON THIS DAY`
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
          options={{
            displayAnnotations: true,
            displayAnnotationsFilter: false,
            displayZoomButtons: false,
            animation: {
              startup: true,
              easing: 'in',
              duration: 5500
            },
            width: '100%',
            height: chartHeight,
            chart: {
              backgroundColor: 'black',
              hAxis: {
                textStyle: {
                  color: 'white',
                  fontName: 'Quicksand'
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
                backgroundColor: 'black',
              }
            },
            annotationsWidth: 25,
            thickness: '2'
          }}
          rootProps={{ 'data-testid': '2' }}
        />
        <div className="annotation-toggle"/>
      </div> }
    </>
  )
}

export default AnnotationChart
