import React, { Component } from 'react';
import { GoogleApiWrapper, Map } from 'google-maps-react';


class GoogleMapsContainer extends Component {

  render() {
    const style = {
      width: '100vw',
      height: '75vh',
    }

    return (
      <Map
        style = { style }
        google = { this.props.google }
        zoom = { 14 }
        initialCenter = {{ lat: 59.9139, lng: 10.7522 }}>
      </Map>
    );
  }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyDOTfCM2U_gpYrE7KAZMiv8XheW2nSpff4'
})(GoogleMapsContainer)