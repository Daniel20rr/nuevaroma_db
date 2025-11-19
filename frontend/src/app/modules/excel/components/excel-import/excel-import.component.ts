import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../../api.service';
import { ChartConfiguration, ChartType } from 'chart.js';

interface SheetData {
  name: string;
  headers: string[];
  data: any[][];
}

interface ColumnDef {
  name: string;
  index: number;
}

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent implements OnInit, OnDestroy {
  
  // ==================== ESTADO GENERAL ====================
  selectedFile: File | null = null;
  status = '';
  progress = 0;
  
  // ==================== WEBSOCKET ====================
  private ws: WebSocket | null = null;
  
  // ==================== SHEETS Y PREVIEW ====================
  sheets: SheetData[] = [];
  selectedSheet = '';
  columns: ColumnDef[] = [];
  previewData: any[][] = [];
  
  // ==================== FILTRADO Y ORDENAMIENTO ====================
  searchControl = new FormControl('');
  filteredData: any[][] = [];
  sortCol = '';
  sortDir: 'asc' | 'desc' = 'asc';
  
  // ==================== PAGINACIÓN ====================
  page = 1;
  pageSize = 10;
  totalPages = 1;
  pagedRows: any[][] = [];
  
  // ==================== SELECCIÓN Y VALIDACIÓN ====================
  selectedRows: boolean[] = [];
  validationErrors: { [rowIndex: number]: string[] } = {};
  duplicateRows: number[] = [];
  
  // ==================== EDICIÓN ====================
  editingCell: { row: number; col: number } | null = null;
  editValue = '';
  
  // ==================== GRÁFICO DE BARRAS (Fila seleccionada) ====================
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartRowIndex = 0;
  
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      label: 'Valores de la fila',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };
  
  // ==================== GRÁFICOS DE ESTADÍSTICAS (Pie Charts) ====================
  loadingStats = false;
  pieStudentsData: number[] = [];
  pieStudentsLabels: string[] = [];
  pieGradesData: number[] = [];
  pieGradesLabels: string[] = [];
  
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  
  public pieStudentsChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  
  public pieStudentsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        enabled: true
      }
    }
  };
  
  public pieGradesChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  
  public pieGradesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.connectWebSocket();
    
    // Escuchar cambios en el buscador
    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
  }

  // ==================== WEBSOCKET ====================
  connectWebSocket(): void {
    this.ws = new WebSocket('ws://localhost:8000/ws/excel-progress');
    
    this.ws.onopen = () => {
      console.log('✅ WebSocket conectado');
    };
    
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.status === 'processing') {
        this.progress = msg.progress || 0;
        this.status = msg.message || 'Procesando...';
      } else if (msg.status === 'done') {
        this.progress = 100;
        this.status = '✅ Carga completada';
      } else if (msg.status === 'error') {
        this.status = '❌ Error: ' + msg.message;
        this.progress = 0;
      }
    };
    
    this.ws.onerror = () => {
      console.warn('⚠️ Error en WebSocket');
    };
    
    this.ws.onclose = () => {
      console.log('🔌 WebSocket cerrado');
    };
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // ==================== SUBIR ARCHIVO ====================
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx')) {
      alert('❌ Solo se permiten archivos .xlsx');
      return;
    }
    
    this.selectedFile = file;
    this.uploadFile();
  }

  uploadFile(): void {
    if (!this.selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    this.status = '📤 Subiendo archivo...';
    this.progress = 0;
    this.sheets = [];
    this.previewData = [];
    this.selectedSheet = '';
    
    fetch('http://localhost:8000/upload-excel/', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.sheets = data.sheets || [];
      this.duplicateRows = this.extractDuplicates(data.duplicates || []);
      
      if (this.sheets.length > 0) {
        this.selectSheet(this.sheets[0].name);
      }
      
      this.status = '✅ Archivo cargado correctamente';
    })
    .catch(err => {
      this.status = '❌ Error al cargar archivo';
      console.error(err);
    });
  }

  extractDuplicates(duplicates: any[]): number[] {
    const allDups: number[] = [];
    duplicates.forEach(d => {
      if (d.rows && Array.isArray(d.rows)) {
        allDups.push(...d.rows);
      }
    });
    return allDups;
  }

  // ==================== SELECCIÓN DE HOJA ====================
  selectSheet(sheetName: string): void {
    this.selectedSheet = sheetName;
    const sheet = this.sheets.find(s => s.name === sheetName);
    
    if (!sheet) return;
    
    this.columns = sheet.headers.map((h, i) => ({ name: h, index: i }));
    this.previewData = sheet.data || [];
    this.filteredData = [...this.previewData];
    
    // Resetear estado
    this.selectedRows = new Array(this.previewData.length).fill(false);
    this.page = 1;
    this.sortCol = '';
    this.sortDir = 'asc';
    this.searchControl.setValue('', { emitEvent: false });
    
    this.validateData();
    this.updatePagination();
    
    // Preparar gráfico de barras con la primera fila
    if (this.previewData.length > 0) {
      this.setChartRow(0);
    }
  }

  // ==================== VALIDACIÓN ====================
  validateData(): void {
    this.validationErrors = {};
    
    this.previewData.forEach((row, idx) => {
      const errors: string[] = [];
      
      // Verificar si está en duplicados
      if (this.duplicateRows.includes(idx)) {
        errors.push('Email duplicado');
      }
      
      // Validar campos vacíos (ejemplo: columnas 0 y 1 obligatorias)
      if (!row[0] || row[0].toString().trim() === '') {
        errors.push('Campo 1 vacío');
      }
      if (!row[1] || row[1].toString().trim() === '') {
        errors.push('Campo 2 vacío');
      }
      
      if (errors.length > 0) {
        this.validationErrors[idx] = errors;
      }
    });
  }

  getErrorRows(): number[] {
    return Object.keys(this.validationErrors).map(k => parseInt(k));
  }

  // ==================== FILTRADO ====================
  applyFilter(): void {
    const term = (this.searchControl.value || '').toLowerCase();
    
    if (!term) {
      this.filteredData = [...this.previewData];
    } else {
      this.filteredData = this.previewData.filter(row =>
        row.some(cell => cell?.toString().toLowerCase().includes(term))
      );
    }
    
    this.page = 1;
    this.updatePagination();
  }

  // ==================== ORDENAMIENTO ====================
  changeSort(colName: string): void {
    const col = this.columns.find(c => c.name === colName);
    if (!col) return;
    
    if (this.sortCol === colName) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCol = colName;
      this.sortDir = 'asc';
    }
    
    this.filteredData.sort((a, b) => {
      const valA = a[col.index];
      const valB = b[col.index];
      
      if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updatePagination();
  }

  // ==================== PAGINACIÓN ====================
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRows = this.filteredData.slice(start, end);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  // ==================== SELECCIÓN ====================
  isAllChecked(): boolean {
    return this.selectedRows.length > 0 && this.selectedRows.every(r => r);
  }

  toggleAll(checked: boolean): void {
    this.selectedRows = this.selectedRows.map(() => checked);
  }

  // ==================== EDICIÓN ====================
  startEdit(rowIdx: number, colIdx: number): void {
    const globalRowIdx = (this.page - 1) * this.pageSize + rowIdx;
    this.editingCell = { row: globalRowIdx, col: colIdx };
    this.editValue = this.filteredData[globalRowIdx]?.[colIdx]?.toString() || '';
  }

  saveEdit(): void {
    if (!this.editingCell) return;
    
    const { row, col } = this.editingCell;
    this.filteredData[row][col] = this.editValue;
    
    // También actualizar en previewData
    const originalIdx = this.previewData.findIndex(r => r === this.filteredData[row]);
    if (originalIdx !== -1) {
      this.previewData[originalIdx][col] = this.editValue;
    }
    
    this.cancelEdit();
    this.validateData();
    this.updatePagination();
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.editValue = '';
  }

  isEditing(rowIdx: number, colIdx: number): boolean {
    const globalRowIdx = (this.page - 1) * this.pageSize + rowIdx;
    return this.editingCell?.row === globalRowIdx && this.editingCell?.col === colIdx;
  }

  // ==================== GRÁFICO DE BARRAS ====================
  setChartRow(index: number): void {
    if (index < 0 || index >= this.previewData.length) return;
    
    this.chartRowIndex = index;
    const row = this.previewData[index];
    
    // Extraer solo valores numéricos
    this.chartData = [];
    this.chartLabels = [];
    
    row.forEach((cell, i) => {
      const val = parseFloat(cell);
      if (!isNaN(val)) {
        this.chartData.push(val);
        this.chartLabels.push(this.columns[i]?.name || `Col ${i + 1}`);
      }
    });
    
    this.barChartData = {
      labels: this.chartLabels,
      datasets: [{
        label: `Fila ${index + 1}`,
        data: this.chartData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  }

  // ==================== GRÁFICOS DE ESTADÍSTICAS ====================
  loadStats(): void {
    this.loadingStats = true;
    
    this.apiService.getStatsTotales().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos:', data);
        
        // Estudiantes
        this.pieStudentsLabels = data.studentsLabels || [];
        this.pieStudentsData = data.studentsData || [];
        
        // Verificar que hay datos
        if (this.pieStudentsData.length > 0) {
          this.pieStudentsChartData = {
            labels: this.pieStudentsLabels,
            datasets: [{
              data: this.pieStudentsData,
              backgroundColor: this.generateColors(this.pieStudentsData.length),
              borderColor: '#ffffff',
              borderWidth: 2
            }]
          };
        }
        
        // Materias
        this.pieGradesLabels = data.gradesLabels || [];
        this.pieGradesData = data.gradesData || [];
        
        // Verificar que hay datos
        if (this.pieGradesData.length > 0) {
          this.pieGradesChartData = {
            labels: this.pieGradesLabels,
            datasets: [{
              data: this.pieGradesData,
              backgroundColor: this.generateColors(this.pieGradesData.length),
              borderColor: '#ffffff',
              borderWidth: 2
            }]
          };
        }
        
        this.loadingStats = false;
        
        // Mensaje de éxito
        if (this.pieStudentsData.length === 0 && this.pieGradesData.length === 0) {
          alert('⚠️ No hay datos de estudiantes o materias en la base de datos');
        } else {
          console.log('✅ Gráficos actualizados correctamente');
        }
      },
      error: (err) => {
        console.error('❌ Error cargando stats:', err);
        this.loadingStats = false;
        alert('❌ Error al cargar estadísticas. Verifica que FastAPI esté corriendo en http://localhost:8000');
      }
    });
  }

  // Generar colores dinámicamente
  private generateColors(count: number): string[] {
    const baseColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#E7E9ED'
    ];
    
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }
}