import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { CoordsModel } from '../../models/coords';
import { Pedometer } from '@ionic-native/pedometer';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
@ViewChild('map') mapRef: ElementRef;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geoLocation: Geolocation,
    public pedometer: Pedometer) {
  }
long: any;
map: any;
previousRoutes: CoordsModel[];
isTracking: boolean;
tracker = null;
marker: any;
reset = true;

default = {
  enableHighAccuracy: true,
  maximumAge: 0
};
  ngOnInit() {
    this.previousRoutes = [];
    this.geoLocation.getCurrentPosition(this.default)
      .then(init => {
      this.showMaps(init.coords.longitude, init.coords.latitude);
  });
  //sets up gett current position every 1 second 
    setInterval(() => { 
      this.trackMe();
      // if(this.reset) {
      //   console.log('hit reset');
      //   this.marker.setMap(null);
      // }
      // this.optionsForMarker.visible = false;
   }, 3000);

  //  this.beginStepCount();
  //  this.drawPath([]);
}

  trackMe() {
    let options = {
      enableHighAccuracy: true,
      maximumAge: 0
    };

    if (this.geoLocation) {
      let i = this.previousRoutes.length-1;
      console.log('i', i);
      this.isTracking = true;
      this.reset = false;
      // this.geoLocation.watchPosition(options)
      // .subscribe(position => {
      //   console.log('CHANGED ');
      //   console.log(position.coords.longitude + ' l  ' + position.coords.latitude);
      //   // use array to draw path 
      //   this.previousRoutes.push({long:position.coords.longitude, lat: position.coords.latitude});
      //   //display map
      //   this.showMap(position.coords.longitude, position.coords.latitude);
      //   this.drawPath(this.previousRoutes);

      // });
      this.geoLocation.getCurrentPosition(options)
      .then(position => {
        this.previousRoutes.push({ lat: position.coords.latitude, lng:position.coords.longitude});
        const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        const optionsForMarker =  {
          position: location,
          visible: true,
          // icon: bluedot,
        }
        if(i >= 0){
          i = this.previousRoutes.length-2;
          console.log('iiii', i)
        const locationold = new google.maps.LatLng(this.previousRoutes[i].lat,this. previousRoutes[i].lng);
        console.log('old', locationold )
        const optionsForMarkerold =  {
          position: locationold,
          visible: true,
          // icon: bluedot,
        }
        const old = new google.maps.Marker(optionsForMarkerold);
        old.setMap(null);
      }

        this.marker = new google.maps.Marker(optionsForMarker);
        

        console.log('set', location);
        this.marker.setMap(this.map);
        this.drawPath(this.previousRoutes);

        

      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    return;
  }
  showMaps(initLongitude, initLatitude){
    const location = new google.maps.LatLng(initLatitude, initLongitude);
    const optionsForMapObject = {
      center: location,
      zoom: 19,
      mapTypeId: 'terrain'
      // mapTypeId: 'satellite'
      //you can disablee ctrls on map in options
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, optionsForMapObject);

  }
 
  drawPath(pathArray){
    // console.log('draw path', pathArray);
    var runPath = new google.maps.Polyline({
      path: pathArray,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    runPath.setMap(this.map);
  }

  beginStepCount(){
  this.pedometer.startPedometerUpdates()
   .subscribe(data => {
     console.log(data);
   });
  
  }
}

