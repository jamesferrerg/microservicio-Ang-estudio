import { Component, OnInit } from '@angular/core';
import { CommonFormComponent } from '../common-form.component';
import { Curso } from '../../models/curso';
import { CursoService } from '../../services/curso.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-curso-form',
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.css']
})
export class CursoFormComponent extends CommonFormComponent<Curso, CursoService> implements OnInit {

  constructor(service: CursoService, 
    router: Router,
    // con route se busca obtener el id
    route: ActivatedRoute) {
      super(service, router, route);
      this.titulo = 'Crear curso';
      this.model = new Curso();
      this.redirect = '/cursos';
      this.nombreModel = Curso.name;
    }

}
