import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from '../../models/curso';
import { CursoService } from '../../services/curso.service';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from 'src/app/models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {

  curso: Curso;
  alumnosAsignar: Alumno[] = [];
  mostrarColumnas: string[] = ['nombre', 'apellido', 'seleccion'];
  mostrarColumnasAlumnos: string[] = ['id', 'nombre', 'apellido', 'email', 'eliminar'];
  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true, []);
  alumnos: Alumno[] = [];
  tabIndex = 0;

  dataSource: MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pageSizeOptions: number[] = [3, 5, 10, 20];

  constructor(private route: ActivatedRoute,
    private cursoService: CursoService,
    private alumnoService: AlumnoService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      this.cursoService.ver(id).subscribe(c => {
        this.curso = c;
        this.alumnos = this.curso.alumnos;
        this.iniciarPaginador();
      });
    });
  }

  iniciarPaginador(): void {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
  }

  filtrar(nombre: string): void {
    // trim() con esto se quitan los espacios en blanco
    nombre = nombre !== undefined ? nombre.trim() : '';
    if (nombre !== '') {
      // filter devuelve un booleano, con esto no permite volver a asignar un alumno al mismo curso
      this.alumnoService.filtrarPorNombre(nombre)
        .subscribe(alumnos => this.alumnosAsignar = alumnos.filter(a => {
          let filtrar = true;
          this.alumnos.forEach(ca => {
            if (a.id === ca.id) {
              filtrar = false;
            }
          });
          return filtrar;
        }));
    }
  }

  estanTodosSeleccionados(): boolean {
    const seleccionados = this.seleccion.selected.length;
    const numAlumnos = this.alumnosAsignar.length;
    return (seleccionados === numAlumnos);
  }

  elegirNoElegirTodos(): void {
    this.estanTodosSeleccionados() ?
      this.seleccion.clear() :
      this.alumnosAsignar.forEach(a => this.seleccion.select(a));
  }

  asignar(): void {
    this.cursoService.asignarAlumnos(this.curso, this.seleccion.selected)
      .subscribe(c => {
        this.tabIndex = 2;
        Swal.fire('Asignados:',
          `Alumnos asignados con exito al curso ${this.curso.nombre}`,
          'success');
        this.alumnos = this.alumnos.concat(this.seleccion.selected);
        this.iniciarPaginador();
        this.alumnosAsignar = [];
        this.seleccion.clear();
      },
        e => {
          if (e.status === 500) {
            const mensaje = e.error.message as string;
            if (mensaje.indexOf('ConstraintViolationException') > -1) {
              Swal.fire('Cuidado!',
                'No se puede asignar el alumno, ya esta asociado a otro curso',
                'error');
            }
          }
        });
  }

  eliminarAlumno(alumno: Alumno): void {

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

        this.cursoService.elminarAlumno(this.curso, alumno)
          .subscribe(curso => {
            this.alumnos = this.alumnos.filter(a => a.id !== alumno.id);
            this.iniciarPaginador();
            Swal.fire(
              'Eliminado!',
              `Alumno ${alumno.nombre} eliminado con exito del curso ${curso.nombre}`,
              'success'
            );
          });

      }
    });

  }


}
