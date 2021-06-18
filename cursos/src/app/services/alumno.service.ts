import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private baseEndPoint = 'http://localhost:8090/api/alumnos';

  constructor(private http: HttpClientModule) { }
}
