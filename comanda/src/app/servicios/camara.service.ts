import { Injectable } from '@angular/core';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { resolve } from 'url';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  constructor(private camera:Camera,private cloud:AngularFireStorage) { }

  /*Toma una foto, guarda en storage y devuelve el link de la foto. solo hay que indicar el nombre de la foto*/ 
  tomarFoto(nombreDeFoto:string){
    const camOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true,
      correctOrientation: true,
    };
  
      
      return new Promise((resolve,rejected)=>{

        this.camera.getPicture(camOptions).then((imageData) => {
        
        const fotoRef=this.cloud.storage.ref(nombreDeFoto);
        fotoRef.putString(imageData,'base64',{contentType:'image/jpeg'}).then(async()=>
        await this.cloud.storage.ref(nombreDeFoto).getDownloadURL().then(downloadLink=>{
          
            
            resolve(downloadLink.toString());//devuelve el link de la imagen
            
        }
        ))
        
      }, (err) => {
        rejected(err);
      });
    })
  }
}
