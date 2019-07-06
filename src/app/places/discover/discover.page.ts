import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {MenuController} from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;

  constructor(
      private placesService: PlacesService,
      private menuCtrl: MenuController,
      private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
    // this.loadedPlaces = this.placesService.places;
    // this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    // console.log('ngOnInit');
    // console.log('loadedPlaces: ', this.loadedPlaces);
    // console.log('placesService places: ', this.placesService.places);
  }

  // ionViewWillEnter() {
  //   this.loadedPlaces = this.placesService.places;
  //   this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  //   console.log('ionViewWillEnter');
  //   console.log('loadedPlaces: ', this.loadedPlaces);
  //   console.log('placesService places: ', this.placesService.places);
  // }

  onOpenmenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
