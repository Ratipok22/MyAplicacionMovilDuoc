// src/app/sms.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private apiUrl = 'http://localhost:3000/send-sms'; // Cambia este URL si es necesario

  constructor() {}

  sendSms(to: string, body: string) {
    return axios.post(this.apiUrl, { to, body });
  }
}