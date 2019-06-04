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

      console.log(marker);
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
        fetch('https://cors-anywhere.herokuapp.com/https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', {
          headers: new Headers({
            'Client-Identifier': 'acn-workshop'
          })
        })
        .then(response => response.json())
        .then(data => {
          this.fetchAndSetAvailability(data.data.stations);
        })
        .catch(error => console.error(error))
      }

    fetchAndSetAvailability = (markers) => {

      fetch('https://cors-anywhere.herokuapp.com/https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', {
        headers: new Headers({
          'Client-Identifier': 'acn-workshop'
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        markers = markers.map((marker) => {
          console.log(marker)
          return Object.assign(marker, this.findStationById(data.data.stations, marker.station_id));
        })
        this.setState(
          {
            markers: markers
          }
        )
      })
      .catch(error => console.error(error))
    }

  findStationById = (stations, station_id) => {
    if(stations.length && station_id) {
      return stations.find(x => x.station_id === station_id);
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
                id = { marker.station_id }
                subtitle = { marker.subtitle }
                bikes = { marker.num_bikes_available }
                locks = { marker.num_docks_available }
                onClick = { this.onMarkerClick }
                position={{ lat: marker.lat, lng: marker.lon }}
                key={ marker.station_id }
                icon = { marker.num_bikes_available === 0 ? noAvailableBikesImage : availableBikesImage  }
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
              id = { this.state.activeMarker.station_id }
            />
        </InfoWindow>
      </Map>
    );
  }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyA37LgFvU9uZ_mTV9TwsMXRK9iz4mjvEfE'
})(GoogleMapsContainer)