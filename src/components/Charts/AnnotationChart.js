import React from 'react'
import Chart from 'react-google-charts'

const AnnotationChart = props => {
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
            label: props.numberType === "total" ? "TOTAL COVID-19 CASES ON THIS DAY" : "NEW COVID-19 CASES RECORDED ON THIS DAY"
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
          height: '450px',
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
        chartEvents={[
          {
            eventName: 'animationfinish',
            callback: () => {
              console.log('Animation Finished')
            },
          },
        ]}
        rootProps={{ 'data-testid': '2' }}
      /> }
    </>
  )
}

export default AnnotationChart
