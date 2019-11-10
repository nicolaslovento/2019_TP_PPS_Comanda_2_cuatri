import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {

  constructor(private cloud:AngularFireStorage) { }

  tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.cloud.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  referenciaCloudStorage(nombreArchivo: string) {
    return this.cloud.storage.ref(nombreArchivo);
}
}
