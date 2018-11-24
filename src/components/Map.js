import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import bikeIcon from '../../src/assets/bike.svg';
import noBikesIcon from '../../src/assets/no-bike.svg';
import MediaCard from './Card';


class GoogleMapsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
          showingInfoWindow: false,
          activeMarker: {},
          markers: []
        }
      }

    componentDidMount() {
      this.fetchStations();
    }

    onMarkerClick = (props, marker, e) => {
      this.setState({
        activeMarker: marker,
        showingInfoWindow: true
      });
    }
    onMapClick = (props) => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: {}
        });
      }
    }

    fetchStations = () => {
        fetch('https://cors-escape.herokuapp.com/https://oslobysykkel.no/api/v1/stations', {
          headers: new Headers({
            'Client-Identifier': '8169e66ebbaf26c18b758abaeaadba0e'
          })
        })
        .then(response => response.json())
        .then(data => {
          this.fetchAndSetAvailability(data.stations);
        })
        .catch(error => console.error(error))
      }

    fetchAndSetAvailability = (markers) => {
      fetch('https://cors-escape.herokuapp.com/https://oslobysykkel.no/api/v1/stations/availability', {
        headers: new Headers({
          'Client-Identifier': '8169e66ebbaf26c18b758abaeaadba0e'
        })
      })
      .then(response => response.json())
      .then(data => {
        markers = markers.map((marker) => {
          return Object.assign(marker, this.findStationById(data.stations, marker.id));
        })
        this.setState(
          {
            markers: markers
          }
        )
      })
      .catch(error => console.error(error))
    }

  findStationById = (stations, id) => {
    if(stations.length && id) {
      return stations.find(x => x.id === id).availability;
    }
  }

  render() {
    const style = {
      width: '100vw',
      height: '75vh',
    }

    let availableBikesImage = {
      url: bikeIcon,
      scaledSize: new this.props.google.maps.Size(40, 40)
    };

    let noAvailableBikesImage = {
      url: noBikesIcon,
      scaledSize: new this.props.google.maps.Size(40, 40)
    };

    return (
      <Map
        style = { style }
        google = { this.props.google }
        zoom = { 14 }
        onClick = { this.onMapClick }
        initialCenter = {{ lat: 59.9139, lng: 10.7522 }}>

        { this.state.markers.map(marker => (

            <Marker
                title = { marker.title }
                id = { marker.id }
                subtitle = { marker.subtitle }
                bikes = { marker.bikes }
                locks = { marker.locks }
                onClick = { this.onMarkerClick }
                position={{ lat: marker.center.latitude, lng: marker.center.longitude }}
                key={ marker.id }
                icon = { marker.bikes === 0 ? noAvailableBikesImage : availableBikesImage  }
            />
        ))}

        <InfoWindow
          marker = { this.state.activeMarker }
          visible = { this.state.showingInfoWindow }>
            <MediaCard
              title= { this.state.activeMarker.title }
              subtitle= { this.state.activeMarker.subtitle }
              bikes = { this.state.activeMarker.bikes }
              locks = { this.state.activeMarker.locks }
              id = { this.state.activeMarker.id }
            />
        </InfoWindow>
      </Map>
    );
  }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyDOTfCM2U_gpYrE7KAZMiv8XheW2nSpff4'
})(GoogleMapsContainer)