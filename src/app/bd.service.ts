import { Injectable } from '@angular/core'

import * as firebase from 'firebase'
import { Progresso } from './progresso.service'

@Injectable()
export class Bd{

  constructor(private progresso: Progresso){}

  public publicar(publicacao: any): void {

    firebase.database()
            .ref(`publicacoes/${btoa(publicacao.email)}`)
            .push({
              'titulo': publicacao.titulo,
            })
            .then( (resposta: any) => {
              let nomeImagem =  resposta.key
              firebase.storage()
                                .ref()
                                .child(`imagens/${nomeImagem}`)
                                .put(publicacao.imagem)
                                .on(firebase.storage.TaskEvent.STATE_CHANGED, //faz a escuta do upload
                                  (snapshot: any) => {
                                    this.progresso.status = 'andamento'
                                    this.progresso.estado = snapshot
                                  },
                                  error => {
                                    this.progresso.status = 'erro'
                                  },
                                  () => {
                                    this.progresso.status = 'concluido'

                                  }
                                )

            })

    //salva a imagem


  }


  public consultaPublicacoes(emailusuario: string): any {
    firebase.database().ref(`publicacoes/${btoa(emailusuario)}`)
                        .once( 'value' )
                        .then( (snapshot: any) => {
                          console.log(snapshot.val())
                          snapshot.forEach( (childSnapshot: any) => {
                            //consulta url da imagem
                            firebase.storage().ref()
                                              .child(`imagens/${childSnapshot.key}`)
                                              .getDownloadURL()
                                                              .then( (url: string) => {
                                                                console.log('this url', url)
                                                              })
                          } )
                        })
  }
}
