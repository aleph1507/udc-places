import { Injectable } from '@angular/core';
import {Place} from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
      new Place('p1',
          'Radovo',
          'p1 description radovo',
          'https://i.ytimg.com/vi/j3oVjZWty3I/hqdefault.jpg',
          149.99),
      new Place('p2',
          'Veles',
          'p2 description veles',
          'https://upload.wikimedia.org/wikipedia/commons/5/53/Veles_panoram.JPG',
          189.99),
      new Place('p3',
        'Lazaropole',
        'p3 description lazaropole',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Church_of_St._George_in_Lazaropole.JPG/220px-Church_of_St._George_in_Lazaropole.JPG',
        99.99)
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
      return {...this._places.find(
          p => p.id === id
      )};
  }
}
