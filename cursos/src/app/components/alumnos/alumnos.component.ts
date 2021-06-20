import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  constructor(private service: AlumnoService) { }

  titulo = 'Listado de Alumnos';
  alumnos!: Alumno[]; 

  ngOnInit(): void {
    this.service.listar().subscribe(alumnos => this.alumnos = alumnos);
  }

  public eliminar(alumno: Alumno): void {

    Swal.fire({
      title: 'Eliminar',
      text: `¿Seguro que desea eliminar a ${alumno.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(alumno.id).subscribe(() => {
          this.alumnos = this.alumnos.filter(a => a !== alumno);
          Swal.fire('Eliminado:', `Alumno ${alumno.id} eliminado con exito`, 'success');
        });
      }
    });
  }

}
