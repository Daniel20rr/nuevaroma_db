import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="container mt-4">

    <h1>Colegio Nuevaroma</h1>

        <ul class="nav nav-tabs mt-3">
      <li class="nav-item">
        <a routerLink="/students" routerLinkActive="active" class="nav-link">Alumnos</a>
      </li>

            <li class="nav-item">
        <a routerLink="/profesores" routerLinkActive="active" class="nav-link">Profesores</a>
      </li>

      <li class="nav-item">
        <a routerLink="/subjects" routerLinkActive="active" class="nav-link">Materias</a>
      </li>

      <li class="nav-item">
        <a routerLink="/grades" routerLinkActive="active" class="nav-link">Notas</a>
      </li>

      <li class="nav-item">
        <a routerLink="/excel" routerLinkActive="active" class="nav-link">Importar Excel</a>
      </li>
    </ul>

    <div class="mt-4">
      <router-outlet></router-outlet>
    </div>

  </div>
  `,
})
export class AppComponent {}