import React from 'react';
import { Platform, Text, View } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { Marker, Polyline } from 'react-native-maps';
import DetailsView from './DetailsView.js';
import TourView from './TourView.js';
import colors from './colors.js';

export default class ListenMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      location: null,
      error: null,
      detailsOpen: false,
      detailLocation: null,
      detailTourId: null,
      tour_title: null,      
      landmarks: [],
      viewingTour: false,
      creatingRoute: false,
      routeList: [],
      renderPoly: false,
      polyArray: [],
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
      viewingTour: false,
      detailsOpen: false
    });
  };


  _extractAudioIDs = (clips) => {
    var res = [];    
    for (var i = 0; i < clips.length; i++) {
      res.push(clips[i]._id);      
    }
    this._extractPlaceIDs(clips);
    return res;                
  }

  _extractPlaceIDs = (clips) => {
    var res = [];
    for (var i = 0; i < clips.length; i++) {
      console.log("Clip nombo " + i + ": "+clips[i]);
      res.push(clips[i].placeid);
    }
    console.log(res);
    return res;
  }

  _createTour = async () => {
    const audios = this._extractAudioIDs(this.state.routeList);
    console.log("Sending new tour "+ this.state.tour_title +", with clips: " + audios);
    fetch(this.pinsUrl + "/newRoute", {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.tour_title,
        description: "temp for now",
        nickname: "hitachi",
        audioIDs: audios                                        
      })
    })
      .then(response => response.json())
      .then(data => {
        return data;                    
      })   
  }

  _viewRouteList = () => {
    this.setState({
      detailLocation: null,
      detailsOpen: true      
    });        
  };

  _addToRouteList = (clipData) => {
    this.setState(prevState => ({
      routeList: [...prevState.routeList, clipData]
    }));
  };

  _removeFromRouteList = (clipData) => {

    this.setState(prevState => {

      let routes = prevState.routeList;
      let index = routes.indexOf(clipData);
      if (index >= 0) {
        routes.splice(index, 1);
      }

      return ({
        routeList: routes
      });

    });
  }

  _clearRouteList = () => {
    this.setState({
      routeList: []
    });
  }

  _openRecordView = (data) => {
    const { navigate } = this.props.navigation;
    navigate('CreateView', {
      location: data
    });
  };

  _viewTour = (tourId) => {
    console.log(tourId);
    this.setState({
      detailTourId: tourId,
      viewingTour: true
    });
  }

  _toggleCreatingRoute = () => {
    this.setState(oldState => ({
      creatingRoute: !oldState.creatingRoute
    }));
  }

  _updateTourTitle = (title) => {
    this.setState({
      tour_title: title
    });    
  }

  _displayRoute = async (clips) => {
    var queryString = this.pinsUrl + "/getGoogleRoute?places=";
    let placeIDs = this._extractPlaceIDs(clips);

    console.log("placeIDs length: " + placeIDs.length);
  
    queryString += placeIDs.join(",");
    queryString += "&optimise=false";      
    
    console.log("queryString: " + queryString);
  
    fetch(queryString)
    .then((res) => {
      return res.json();
    }).then((data) => {
      console.log(data);
      this.setState({
        renderPoly: true,
        polyArray: data.routes
      });
    })
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
            latitudeDelta: 0.0100,
            longitudeDelta: 0.010,
          }}
          minZoomLevel={2}
          showsUserLocation={true}
        >
        {this.state.renderPoly &&
          <Polyline
          coordinates={this.state.polyArray}
          strokeWidth={this.state.viewingTour ? 7 : 0}
          strokeColor={colors.clr_dark} />
        }
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
                viewRouteList={this._viewRouteList}
                creatingRoute={this.state.creatingRoute}
                routeList={this.state.routeList}
                updateTourTitle={this._updateTourTitle}                                            
                addToRouteList={this._addToRouteList}
                removeFromRouteList={this._removeFromRouteList}
                clearRouteList={this._clearRouteList}
                toggleCreatingRoute={this._toggleCreatingRoute}
                uploadTour={this._createTour}
              />
            ) : (
              <TourView
                openRecordView={this._openRecordView}
                closeFunc={this._closeDetailView}
                locationId={this.state.detailLocation}
                tourId={this.state.detailTourId}
                displayRoute={this._displayRoute}
              />
            )}

          </View>
        }
      </View>
    );
  }
}