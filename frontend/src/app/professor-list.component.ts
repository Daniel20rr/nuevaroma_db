import { Component, OnInit } from '@angular/core';
// CORRECCIÓN: Cambiar '../professor.service' a './professor.service'
import { ProfessorService } from './professor.service'; 

@Component({
  selector: 'app-professor-list',
  templateUrl: './professor-list.component.html'
})
export class ProfessorListComponent implements OnInit {

  profesores: any[] = [];

  constructor(private profService: ProfessorService) {}

  ngOnInit() {
    this.cargarProfesores();
  }

  cargarProfesores() {
    this.profService.listarProfesores().subscribe(res => {
      this.profesores = res;
    });
  }

  eliminar(id: number) {
    if (confirm("¿Seguro que deseas eliminar este profesor?")) {
      this.profService.eliminarProfesor(id).subscribe(() => {
        this.cargarProfesores();
      });
    }
  }
}