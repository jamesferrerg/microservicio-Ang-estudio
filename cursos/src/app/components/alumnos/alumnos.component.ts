import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from '../../models/alumno';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  constructor(private service: AlumnoService) { }

  titulo = 'Listado de Alumnos';
  alumnos!: Alumno[];

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 4;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.calcularRangos();
  }

  paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  private calcularRangos(){
    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString())
      .subscribe(p => 
        {
          this.alumnos = p.content as Alumno[];
          this.totalRegistros = p.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros por pagina:';
        });
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
          // this.alumnos = this.alumnos.filter(a => a !== alumno);
          this.calcularRangos();
          Swal.fire('Eliminado:', `Alumno ${alumno.id} eliminado con exito`, 'success');
        });
      }
    });
  }

}
