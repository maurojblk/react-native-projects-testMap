import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

var markers =
  [
    {
      "coords": {
        "accuracy": 30,
        "altitude": 60.595703125,
        "altitudeAccuracy": 64,
        "heading": -1,
        "latitude": -31.761521170876698,
        "longitude": -60.52073456352625,
        "speed": 0
      },
      "name": "195735839",
      "timestamp": 1490119010999.8787
    }
  ];

export default class testMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      region: [],
      arrayOfCoords: [],
    };
    this.getCoordinates();    
  }
 
  getCoordinates() {
    fetch('http://locomoto.pathfinding.com.ar/get_positions')
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          region: {
            latitude: responseData[0].coords.latitude,
            longitude: responseData[0].coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          arrayOfCoords: responseData
        })
      })
      .catch((error) => console.warn("fetch error:", error))
  }

  getMarkCoordinates(i) {
    return {
      latitude: this.state.arrayOfCoords[i].coords.latitude,
      longitude: this.state.arrayOfCoords[i].coords.longitude
    }
  }

  getMarker(i) {
    return (
      <MapView.Marker
        key={i}
        coordinate={this.getMarkCoordinates(i)}
        title={this.state.arrayOfCoords[i].name}
        description={this.state.arrayOfCoords[i].coords.latitude + ' ' + this.state.arrayOfCoords[i].coords.longitude}
      />);
  }

  getMarkers() {
    var arrayOfMarkers = [];
    for (var i = 0; i < this.state.arrayOfCoords.length; i++) { 
      arrayOfMarkers[i] = this.getMarker(i);
    }
    return (arrayOfMarkers);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.region.latitude ?
          <MapView
            provider={this.props.provider}
            style={styles.map}
            initialRegion={this.state.region}>
            {this.getMarkers()}
          </MapView>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    width: width,
  },
});

AppRegistry.registerComponent('testMap', () => testMap);
