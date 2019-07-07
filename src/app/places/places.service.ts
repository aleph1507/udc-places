import { Injectable } from '@angular/core';
import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface PlaceData {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    availableFrom: string;
    availableTo: string;
    userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
      [
      //     new Place('p1',
      //         'Radovo',
      //         'p1 description radovo',
      //         'https://i.ytimg.com/vi/j3oVjZWty3I/hqdefault.jpg',
      //         149.99,
      //         new Date('2019-01-01'),
      //         new Date('2019-12-31'),
      //         'abc'
      //     ),
      //     new Place('p2',
      //         'Veles',
      //         'p2 description veles',
      //         'https://upload.wikimedia.org/wikipedia/commons/5/53/Veles_panoram.JPG',
      //         189.99,
      //         new Date('2019-01-01'),
      //         new Date('2019-12-31'),
      //         'abc'
      //     ),
      //     new Place('p3',
      //         'Lazaropole',
      //         'p3 description lazaropole',
      //         'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Church_of_St._George_in_Lazaropole.JPG/220px-Church_of_St._George_in_Lazaropole.JPG',
      //         99.99,
      //         new Date('2019-01-01'),
      //         new Date('2019-12-31'),
      //         'abc'
      //     )
      ]
  ) ;

  get places() {
    // return [...this._places];
      return this._places.asObservable();
  }

  constructor(
          private authService: AuthService,
          private http: HttpClient
      ) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-4f200.firebaseio.com/offered-places.json')
        .pipe(
                map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(new Place(key, resData[key].title,
                                resData[key].description, resData[key].imageUrl, resData[key].price,
                                new Date(resData[key].availableFrom), new Date(resData[key].availableTo),
                                resData[key].userId));
                        }
                    }
                    return places;
                    // return [];
                }),
            tap(places => {
                this._places.next(places);
            })
        );
  }

  getPlace(id: string) {
      return this.http.get<PlaceData>(
          `https://ionic-angular-4f200.firebaseio.com/offered-places/${id}.json`
      ).pipe(
          map(placeData => {
              return new Place(id, placeData.title,
                  placeData.description, placeData.imageUrl,
                  placeData.price, new Date(placeData.availableFrom),
                  new Date(placeData.availableTo), placeData.userId);
          })
      );

      // return this.places.pipe(take(1),
      //     map(places => {
      //        return { ...places.find(p => p.id === id)};
      //     }
      // ));


      // return {...this._places.find(
      //     p => p.id === id
      // )};
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
      let generatedId: string;
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
      return this.http.post<{name: string}>('https://ionic-angular-4f200.firebaseio.com/offered-places.json', {
          ...newPlace, id: null
      }).pipe(
          switchMap(resData => {
              generatedId = resData.name;
              return this.places;
          }),
          take(1),
          tap(places => {
              newPlace.id = generatedId;
              this._places.next(places.concat(newPlace));
          })
      );
      // return this.places.pipe(
      //     take(1),
      //     delay(1000),
      //     tap((places) => {
      //       this._places.next(places.concat(newPlace));
      //    }
      // ));
      //     .subscribe(places => {
      //     setTimeout(() => {
      //         this._places.next(places.concat(newPlace));
      //     }, 1000);
      // });
  }

  updatePlace(placeId: string, title: string, description: string) {
      let updatedPlaces: Place[];
      return this.places.pipe(
          take(1),
          switchMap(places => {
              if (!places || places.length <= 0) {
                  return this.fetchPlaces();
              } else {
                  return of(places);
              }
          }),
          switchMap(places => {
              const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
              updatedPlaces = [...places];
              const oldPlace = updatedPlaces[updatedPlaceIndex];
              updatedPlaces[updatedPlaceIndex] =
                  new Place(oldPlace.id, title, description,
                      oldPlace.imageUrl, oldPlace.price,
                      oldPlace.availableFrom, oldPlace.availableTo,
                      oldPlace.userId
                  );
              return this.http.put(
                  `https://ionic-angular-4f200.firebaseio.com/offered-places/${placeId}.json`,
                  { ...updatedPlaces[updatedPlaceIndex], id: null }
              );
            }),
            tap(() => {
                      this._places.next(updatedPlaces);
                  })
              );

      // return this.places.pipe(
      //     take(1),
      //     tap(places => {
      //         const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      //         const updatedPlaces = [...places];
      //         const oldPlace = updatedPlaces[updatedPlaceIndex];
      //         updatedPlaces[updatedPlaceIndex] =
      //             new Place(oldPlace.id, title, description,
      //                 oldPlace.imageUrl, oldPlace.price,
      //                 oldPlace.availableFrom, oldPlace.availableTo,
      //                 oldPlace.userId
      //             );
      //         this._places.next(updatedPlaces);
      //     })
      // );
  }
}
