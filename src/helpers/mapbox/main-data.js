// Adds divided regions of New Zealand based on district health board
export function addDHBRegions(map, hoveredStateId) {
  map.addLayer({
    'id': 'dhb-highlight-fills',
    'type': 'fill',
    'source': 'mapbox-dhb',
    'source-layer': 'statsnzdistrict-health-board--7z54ly',
    'paint': {
      'fill-color': '#6b91db',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.6,
        0.08
      ]
    }
  })
  // Highlight on hover
  map.on('mousemove', 'dhb-highlight-fills', function(e) {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({
          source: 'mapbox-dhb',
          sourceLayer: 'statsnzdistrict-health-board--7z54ly',
          id: hoveredStateId
        }, {
          hover: false
        })
      }
      hoveredStateId = e.features[0].id
      map.setFeatureState({
        source: 'mapbox-dhb',
        sourceLayer: 'statsnzdistrict-health-board--7z54ly',
        id: hoveredStateId
      }, {
        hover: true
      })
    }
  })
  map.on('mouseleave', 'dhb-highlight-fills', function() {
    if (hoveredStateId) {
      map.setFeatureState({
        source: 'mapbox-dhb',
        sourceLayer: 'statsnzdistrict-health-board--7z54ly',
        id: hoveredStateId
      }, {
        hover: false
      })
    }
    hoveredStateId = null
  })
}

// Creates a data source
export function createPointsSource(map) {
  map.addSource('points', {
    type: 'geojson',
    data: {
      'type': 'FeatureCollection',
      'features': []
    }
  })
  // Change the cursor to a pointer when the mouse is over the points layer.
  map.on('mouseenter', 'points', function() {
    map.getCanvas().style.cursor = 'pointer'
  })
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'points', function() {
    map.getCanvas().style.cursor = ''
  })
}

// Adds location of district health boards for use as markers
export function showDHBNames(map, dhbList) {
  // Map DHB names as points
  map.getSource('points').setData({
    'type': 'FeatureCollection',
    'features': dhbList.map(function(dhb) {
      return {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [dhb.lng, dhb.lat]
        },
        'properties': {
          'title': dhb.name.toUpperCase()
        }
      }
    })
  })
  // Show names of district health boards
  map.addLayer({
    'id': 'districtHealthBoardName',
    'type': 'symbol',
    'source': 'points',
    'layout': {
      'icon-image': 'circle-white-2',
      'icon-size': 0.35,
      // 'icon-allow-overlap': true,
      'text-field': ['get', 'title'],
      'text-size': 12,
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
      // 'text-allow-overlap': true
    },
    'paint': {
      'text-color': 'white'
    }
  })
}
