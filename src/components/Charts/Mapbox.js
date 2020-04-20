import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import axios from 'axios'

import { dhbList } from '../../helpers/general-data'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

var chartHeight

class Mapbox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: 172.515,
      lat: -41.206,
      zoom: 3.8
    }
    if (window.screen.width > window.screen.height) chartHeight = '70vh'
    else chartHeight = '50vh'
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/rlyhan/ck98cd91l3zpm1imxqvljfg9y',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    })
    var hoveredStateId = null
    map.on('load', () => {
      map.addSource('mapbox-dhb', {
        type: 'vector',
        url: 'mapbox://rlyhan.4ym0j96h'
      });
      // DHB BOUNDARY LINES
      map.addLayer({
        'id': 'dhb-data',
        'type': 'line',
        'source': 'mapbox-dhb',
        'source-layer': 'statsnzdistrict-health-board--7z54ly',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#2e5cb8',
          'line-width': 1
        }
      });
      // HOVER ON HIGHLIGHT
      map.addLayer({
        'id': 'dhb-highlight-fills',
        'type': 'fill',
        'source': 'mapbox-dhb',
        'source-layer': 'statsnzdistrict-health-board--7z54ly',
        'layout': {},
        'paint': {
          'fill-color': '#2e5cb8',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.2
          ]
        }
      });
      map.on('mousemove', 'dhb-highlight-fills', function(e) {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState({
              source: 'mapbox-dhb',
              sourceLayer: 'statsnzdistrict-health-board--7z54ly',
              id: hoveredStateId
            }, {
              hover: false
            });
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState({
            source: 'mapbox-dhb',
            sourceLayer: 'statsnzdistrict-health-board--7z54ly',
            id: hoveredStateId
          }, {
            hover: true
          });
        }
      });
      map.on('mouseleave', 'dhb-highlight-fills', function() {
        if (hoveredStateId) {
          map.setFeatureState({
            source: 'mapbox-dhb',
            sourceLayer: 'statsnzdistrict-health-board--7z54ly',
            id: hoveredStateId
          }, {
            hover: false
          });
        }
        hoveredStateId = null;
      });
      // POINTS
      map.addSource('points', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': dhbList.map(function(dhb) {
            return {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [
                  dhb.lng,
                  dhb.lat
                ]
              },
              'properties': {
                'title': dhb.name.toUpperCase(),
                'icon': 'harbor'
              }
            }
          })
        }
      });
      map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          // get the icon name from the source's "icon" property
          // concatenate the name to get an icon from the style's sprite sheet
          'icon-image': 'circle-white-2',
          'icon-size': 0.35,
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-size': 12,
          // 'text-font': ['Quicksand', sans-serif'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top'
        },
        'paint': {
          'text-color': 'white'
        }
      });
    })
    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      })
    })
  }

  render() {
    return (
      <>
          <div ref={el => this.mapContainer = el}
             style={{
               height: chartHeight,
               border: '1px solid #212121'
             }} />
      </>
    )
  }

}

export default Mapbox
