import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-cookie-modal',
  templateUrl: './cookie-modal.component.html',
  styleUrls: ['./cookie-modal.component.css'],
  imports: [
    FormsModule,CommonModule
  ],
  standalone: true
})
export class CookieModalComponent implements OnInit {
  isVisible = true; // Mostrar el modal al cargar la página
  preferences = {
    marketing: false,
    functional: false,
  };

  constructor() {}

  ngOnInit(): void {
    // Ocultar el modal si las cookies ya están configuradas
    if (this.getCookie('cookiesConfigured')) {
      this.isVisible = false;
    }
  }

  acceptAll(): void {
    this.preferences.marketing = true;
    this.preferences.functional = true;
    this.savePreferences();
  }

  rejectAll(): void {
    this.preferences.marketing = false;
    this.preferences.functional = false;
    this.savePreferences();
  }

  savePreferences(): void {
    this.setCookie('cookiesConfigured', 'true', 365);
    this.setCookie('marketing', this.preferences.marketing.toString(), 365);
    this.setCookie('functional', this.preferences.functional.toString(), 365);
    this.isVisible = false;
  }

  // Función para guardar cookies
  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  }

  // Función para leer cookies
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}
