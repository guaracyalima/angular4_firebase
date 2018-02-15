import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import { Bd } from '../../bd.service'
import * as firebase from 'firebase'
import { Progresso } from '../../progresso.service'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs'
@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public email: string
  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  })

  private imagem: any

  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number

  constructor(
                private bd: Bd,
                private progresso: Progresso
              ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged( (user) => {
      this.email = user.email
    })
  }

  public publicar(): void{
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    })

    let acompanhamentoUpload =  Observable.interval(1500)
    let continua = new Subject()

    acompanhamentoUpload
                        .takeUntil(continua)
                        .subscribe( () => {
                          this.progressoPublicacao = 'andamento'

                          this.porcentagemUpload = Math.round(
                            (this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes) * 100
                          )


                          if(this.progresso.status === 'concluido'){
                            this.progressoPublicacao = 'concluido'
                            continua.next(false)
                          }
                        })


  }

  public preparaImagemUpload(event):  void{
    this.imagem = (<HTMLInputElement> event.target).files
  }

}
