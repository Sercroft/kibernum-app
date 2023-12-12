import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastController){}

  async presentToast(msj: string, duration: number, position: any = 'top') {
    const toast = await this.toast.create({
      position  : position,
      message   : msj,
      duration  : duration,
      cssClass: 'custom-toast'
    });

    return toast.present();
  }
}
