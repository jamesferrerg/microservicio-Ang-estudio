import { Component, OnInit } from '@angular/core';
import { CommonListarComponent } from '../common-listar.component';
import { ExamenService } from '../../services/examen.service';
import { Examen } from '../../models/examen';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent extends CommonListarComponent<Examen, ExamenService> implements OnInit {

  constructor(service: ExamenService) {
    super(service);
    this.titulo = 'Listado de examenes';
    this.nombreModel = Examen.name;
  }

}
