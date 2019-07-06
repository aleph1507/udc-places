import { Injectable } from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {take, map, tap, delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
      [
          new Place('p1',
              'Radovo',
              'p1 description radovo',
              'https://i.ytimg.com/vi/j3oVjZWty3I/hqdefault.jpg',
              149.99,
              new Date('2019-01-01'),
              new Date('2019-12-31'),
              'abc'
          ),
          new Place('p2',
              'Veles',
              'p2 description veles',
              'https://upload.wikimedia.org/wikipedia/commons/5/53/Veles_panoram.JPG',
              189.99,
              new Date('2019-01-01'),
              new Date('2019-12-31'),
              'abc'
          ),
          new Place('p3',
              'Lazaropole',
              'p3 description lazaropole',
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Church_of_St._George_in_Lazaropole.JPG/220px-Church_of_St._George_in_Lazaropole.JPG',
              99.99,
              new Date('2019-01-01'),
              new Date('2019-12-31'),
              'abc'
          )
      ]
  ) ;

  get places() {
    // return [...this._places];
      return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
      return this.places.pipe(take(1),
          map(places => {
             return { ...places.find(p => p.id === id)};
          }
      )) ;
      // return {...this._places.find(
      //     p => p.id === id
      // )};
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
      const newPlace = new Place(
          Math.random().toString(),
          title, description,
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Church_of_St._George_in_Lazaropole.JPG/220px-Church_of_St._George_in_Lazaropole.JPG',
          price,
          dateFrom,
          dateTo,
          this.authService.userId
      );
      // this._places.push(newPlace);
      return this.places.pipe(take(1), delay(1000), tap((places) => {
          this._places.next(places.concat(newPlace));
        }
      ));
      //     .subscribe(places => {
      //     setTimeout(() => {
      //         this._places.next(places.concat(newPlace));
      //     }, 1000);
      // });
  }

  updatePlace(placeId: string, title: string, description: string) {
      return this.places.pipe(
          take(1),
          delay(1000),
          tap(places => {
              const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
              const updatedPlaces = [...places];
              const oldPlace = updatedPlaces[updatedPlaceIndex];
              updatedPlaces[updatedPlaceIndex] =
                  new Place(oldPlace.id, title, description,
                      oldPlace.imageUrl, oldPlace.price,
                      oldPlace.availableFrom, oldPlace.availableTo,
                      oldPlace.userId
                  );
              this._places.next(updatedPlaces);
          })
      );
  }
}
