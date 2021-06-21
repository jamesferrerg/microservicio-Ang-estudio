import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class CursoService extends CommonService<Curso> {

  protected baseEndPoint = BASE_ENDPOINT + '/cursos';

  constructor(http: HttpClient) {
    super(http);
  }

}
