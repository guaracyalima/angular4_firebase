import { Component, OnInit } from '@angular/core';
import { Bd } from '../../bd.service'
import * as firebase from 'firebase'

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit {

  public email: string
  constructor(private bd: Bd) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email

      this.atualizarTimeline()
    })
  }

  public atualizarTimeline(): void{
    this.bd.consultaPublicacoes(this.email)
  }

}
