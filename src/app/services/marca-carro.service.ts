import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarcaCarro } from '../models/MarcaCarro';
import { map } from 'rxjs/operators';

interface CarResponse {
  Makes: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaCarroService {

  private API_CARROS = 'https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes';

  constructor(
    private http: HttpClient,
  ) { 

  }

  private mapMarcas(marcas: any[]): MarcaCarro[] {
    return marcas.map((marca: any) => ({
      codigo: marca.make_id,
      nome: marca.make_display
    }));
  }

  public getMarcas(): Observable<MarcaCarro[]> {
    return this.http.jsonp<CarResponse>(this.API_CARROS, 'callback')
    .pipe(
      map((res: CarResponse) => this.mapMarcas(res.Makes))
    );
  }
  
}
