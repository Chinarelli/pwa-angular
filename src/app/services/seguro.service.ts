import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Seguro } from '../models/Seguro';
import { Observable } from 'rxjs';
import { OnlineOfflineService } from './online-offline.service';
import Dexie from 'dexie'
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<Seguro> {

  constructor(
    protected injector: Injector
  ) { 
    super(injector, 'seguro', 'http://localhost:9000/api/seguros');
  }
}
