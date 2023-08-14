import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlbumDataService {
  private album: any;
  constructor(  private http: HttpClient){

  }

  setAlbum(album: any) {
    this.album = album;
    localStorage.setItem('albumState', JSON.stringify(album));
  }

  // get the current album from the local storage 
  getAlbum() {
    if (!this.album) {
      const storedAlbum = localStorage.getItem('albumState');
      this.album = storedAlbum ? JSON.parse(storedAlbum) : null;
    }
    return this.album;
  }


  getAlbumById(albumId: string){
   return this.http.get(`http://localhost:3000/music/${albumId}`);
  }
}
