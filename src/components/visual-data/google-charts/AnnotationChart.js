import React from 'react'
import Chart from 'react-google-charts'

const AnnotationChart = props => {
  let chartHeight
  if (window.screen.width > window.screen.height) chartHeight = 'calc(80vh - 54px)'
  else chartHeight = '70vh'

  return (
    <>
    { props.data === [] ?
      <div>Loading...</div> :
      props.data === null ?
      <div>Could not fetch data. Please try again.</div> :
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
            label: props.numberType === "total" ? `TOTAL ${props.caseType.toUpperCase()} COVID-19 CASES TO THIS DAY` : `NEW ${props.caseType.toUpperCase()} COVID-19 CASES RECORDED ON THIS DAY`
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
          // displayAnnotationsFilter: true,
          displayZoomButtons: false,
          animation: {
            startup: true,
            easing: 'in',
            duration: 5500
          },
          width: '100%',
          height: chartHeight,
          minHeight: '300px',
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
      /> }
    </>
  )
}

export default AnnotationChart
