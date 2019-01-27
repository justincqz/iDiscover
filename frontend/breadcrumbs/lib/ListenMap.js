import React from 'react';
import { Platform, Text, View } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { Marker } from 'react-native-maps';
import DetailsView from './DetailsView.js';
import TourView from './TourView.js';

export default class ListenMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      location: null,
      error: null,
      detailsOpen: false,
      detailLocation: null,
      deatilTourId: null,
      landmarks: [],
      viewingTour: false
    }

    this._getLocationAsync = this._getLocationAsync.bind(this);
    this.pinsUrl = "http://hanneshertach.com:3001/api";

  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        error: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        error: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    // You're calling this non stop I guess
    this.setState({ 
      location
    });
    this._getPinsAsync();
  };

  _getPinsAsync = async () => {

    fetch(this.pinsUrl + "/getNearbyAttractions?lat=" + this.state.location.coords.latitude + "&lon=" + this.state.location.coords.longitude)
    .then((res) => {
      return res.json();
    }).then((data) => {
      this.setState({
        loading: false,
        landmarks: data.landmarks
      });
      console.log(data);
    }).catch((err) => {
      this.setState({
        loading: false,
        error: true
      })
    });

  }

  _calloutPressed = (place) => {
    this.setState({
      detailLocation: place,
      detailsOpen: true
    });
  };

  _closeDetailView = () => {
    this.setState({
      detailsOpen: false
    });
  };

  _openRecordView = () => {
    console.log("Here");
    const { navigate } = this.props.navigation;
    navigate('CreateView');
  };

  _viewTour = (tourId) => {
    this.setState({
      detailtourId: tourId,
      viewTour: true
    });
  }

  render() {

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }

    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            An error occured. You might be offline.
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1}}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0200,
            longitudeDelta: 0.090,
          }}
        >
        {this.state.landmarks.map((landmark, i) => {
          let callback = () => {
            this._calloutPressed(landmark);
          };
          callback = callback.bind(this);

          return (<Marker
              coordinate={{
                latitude: landmark.lat,
                longitude: landmark.lon
              }}
              title={landmark.name}
              description=""
              onCalloutPress={callback}
              key={i}
            />)
          })
        }
        </MapView>
        {
          this.state.detailsOpen && 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            { !this.state.viewingTour ? (
              <DetailsView
                openRecordView={this._openRecordView}
                closeFunc={this._closeDetailView}
                location={this.state.detailLocation}
                viewTour={this._viewTour}
              />
            ) : (
              <TourView
                openRecordView={this._openRecordView}
                closeFunc={this._closeDetailView}
                locationId={this.state.detailLocationId}
              />
            )}

          </View>
        }
      </View>
    );
  }
}