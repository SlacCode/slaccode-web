import {Component, ElementRef, Inject, PLATFORM_ID, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {catchError, of, tap} from "rxjs";
import {SuccessModalComponent} from "./components/success-modal/success-modal.component";
import {ErrorModalComponent} from "./components/error-modal/error-modal.component";
import {CookieModalComponent} from "./components/cookie-modal/cookie-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, CookieModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild('successModalTemplate') successModalTemplate!: TemplateRef<any>;
  @ViewChild('errorModalTemplate') errorModalTemplate!: TemplateRef<any>;
  @ViewChild('imageContainer') imageContainer!: ElementRef;

  activeImage: string = 'assets/img/features/image1.jpg'; // Imagen inicial activa

  // Lista de características con sus respectivas imágenes
  features = [
    {
      title: 'Modi sit est dela pireda nest',
      description: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat...',
      icon: 'bi bi-person-circle',
      image: 'assets/img/features/image1.jpg',
    },
    {
      title: 'Unde praesent mara setra le',
      description: 'Recusandae atque nihil. Delectus vitae non similique...',
      icon: 'bi bi-box',
      image: 'assets/img/features/image2.jpg',
    },
    {
      title: 'Pariatur explica nitro dela',
      description: 'Excepteur sint occaecat cupidatat non proident...',
      icon: 'bi bi-sun',
      image: 'assets/img/features/image3.jpg',
    },
  ];

  emailForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    empresa: ['', Validators.required],
    telefono: ['', [Validators.required, this.validarFormatoTelefono()]],
    asunto: ['', Validators.required],
    mensaje: ['', [Validators.required, Validators.minLength(50)]],
  });

  modalRef!: BsModalRef;
  message: string | null = null;

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object,
      private fb: FormBuilder,
      private modalService: BsModalService
  ) {}

  // Cambiar la imagen activa
  setActiveImage(image: string): void {
    this.activeImage = image;
  }

  validarFormatoTelefono(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const telefono = control.value;
      const formatoTelefono = /^\+\d{1,3}\d{6,}$/; // Formato +123456789

      if (telefono && !formatoTelefono.test(telefono)) {
        return { formatoInvalido: true };
      }

      return null;
    };
  }
  sendFrom() {
    if (this.emailForm.valid) {
      this.sendEmail();
    }
  }

  private sendEmail() {
    const headers = { 'Content-Type': 'application/json' };
    this.http
        .post(
            'https://pagina-web-backend.vercel.app/send-mail',
            this.emailForm.value,
            { headers }
        )
        .pipe(
            tap((response: any) => {
              console.log(response);
              this.message = '¡Correo enviado con éxito!';
              this.message = null;
              this.openSuccessModal(this.message);
              this.emailForm.reset();
            }),
            catchError((error: any) => {
              console.error(error);
              this.message =
                  '¡Ups! Error al enviar el correo. Por favor, inténtalo de nuevo.';
              this.message = null;
              this.openErrorModal(this.message);
              return of(error);
            })
        )
        .subscribe();
  }

  openSuccessModal(message: any) {
    this.modalRef = this.modalService.show(SuccessModalComponent, {
      initialState: { message },
    });
  }

  openErrorModal(message: any) {
    this.modalRef = this.modalService.show(ErrorModalComponent, {
      initialState: { message },
    });
  }

  closeModals() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}

