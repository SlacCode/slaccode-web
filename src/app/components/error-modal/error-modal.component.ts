import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-content">
      <div class="text-center">
        <h4 class="modal-title">
          <i class="fa fa-exclamation-circle mr-2" style="font-size: 128px; color: #dc006d;"></i>
        </h4>
      </div>
      <div class="text-center">
        <p class="lead" style="color: #dc006d;">{{ message }}</p>
      </div>
      <div class="text-center" style="margin-bottom: 5%;">
        <button type="button" class="btn btn-danger" (click)="onClose()">Cerrar</button>
      </div>
    </div>
  `,
  styleUrls: ['./error-modal.component.css'],
})
export class ErrorModalComponent {
  @Input() message!: string; // Mensaje para mostrar
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  onClose() {
    this.close.emit();
  }
}
