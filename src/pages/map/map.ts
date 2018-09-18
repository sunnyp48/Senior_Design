import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { CoordsModel } from '../../models/coords';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
@ViewChild('map') mapRef: ElementRef;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geoLocation: Geolocation) {
  }
long: any;
map: any;
previousRoutes: CoordsModel[];
isTracking: boolean;
tracker = null;
  ionViewDidLoad() {
    this.trackMe();
  }
  showMap(longitude, latitude){
    const location = new google.maps.LatLng(latitude, longitude);
    const optionsForMapObject = {
      center: location,
      zoom: 5,
      // mapTypeId: google.maps.MapTypeId.ROADMAP
      //you can disablee ctrls on map in options
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, optionsForMapObject);
    this.addMarker(location,this.map);
  }
  addMarker(position,map)
  {   
    // let image = '../images/assets';
    var marker = new google.maps.Marker({
    position: position,
    title:"Hello World!",
    visible: true,
    // icon: bluedot,
  });
    marker.setMap(map);
  }
  trackMe() {

    let options = {
      enableHighAccuracy: true,
      maximumAge: 0
    };

    if (this.geoLocation) {
      this.previousRoutes = [];
      this.isTracking = true;
      this.geoLocation.watchPosition(options)
      .pipe(
        filter(pos => pos.coords !== undefined)
      )
      .subscribe(position => {
        console.log(position.coords.longitude + ' l  ' + position.coords.latitude);
        // use array to draw path 
        this.previousRoutes.push({long:position.coords.longitude, lat: position.coords.latitude});
        //display map
        this.showMap(position.coords.longitude, position.coords.latitude);
        this.drawPath(this.previousRoutes);

      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  drawPath(pathArray){
    const check = _.map(pathArray, p => {
          console.log('this', p);
    });
    // if(pathArray.length > 1){
    //   this.tracker = new google.maps.Polyline({
    //     path: pathArray,
    //     geodesic: true,
    //     strokeColor: '#ff00ff',
    //   });
    // }

  }
}

/*    .subscribe(data => {
  setTimeout(() => {
    this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
    this.redrawPath(this.trackedRoute);
  }, 0);
});

}

redrawPath(path) {
if (this.currentMapTrack) {
this.currentMapTrack.setMap(null);
}

if (path.length > 1) {
this.currentMapTrack = new google.maps.Polyline({
  path: path,
  geodesic: true,
  strokeColor: '#ff00ff',
  strokeOpacity: 1.0,
  strokeWeight: 3
});
this.currentMapTrack.setMap(this.map);
}
}*/
