import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// CORRECCIÓN: Cambiar '../professor.service' a './professor.service'
import { ProfessorService } from './professor.service';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html'
})
export class ProfessorFormComponent implements OnInit {

  id!: number;
  isEdit = false;

  profesor = {
    nombre: "",
    apellido: "",
    email: "",
    especialidad: ""
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profService: ProfessorService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));

    if (this.id) {
      this.isEdit = true;
      this.profService.obtenerProfesor(this.id).subscribe(res => {
        this.profesor = res;
      });
    }
  }

  guardar() {
    if (this.isEdit) {
      this.profService.actualizarProfesor(this.id, this.profesor).subscribe(() => {
        this.router.navigate(['/profesores']);
      });
    } else {
      this.profService.crearProfesor(this.profesor).subscribe(() => {
        this.router.navigate(['/profesores']);
      });
    }
  }
}