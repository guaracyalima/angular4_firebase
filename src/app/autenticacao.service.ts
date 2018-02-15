import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Usuario } from './acesso/usuario.model'
import * as firebase from 'firebase'

@Injectable()
export class Autenticacao{

  public token_id: string

  constructor(private router: Router){}

  public cadastrarUsuario(usuario: Usuario): Promise<any>{
    return firebase
            .auth()
            .createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then( (resposta: any) => {

              //a funcao btoa converte para base64
              //a funcao atob descriptografa de base64

              //remove o asenha do objeto que vai ser salvo
              delete usuario.senha;

              //salva os demais dados do usuario
              firebase
                      .database()
                      .ref(`usuario_detalhe/${btoa(usuario.email)}`)
                      .set( usuario );
            })
            .catch((error: any) => {
              console.log(error);
            });
  }

  public autenticar(email: string, senha: string): void {
    firebase
            .auth()
            .signInWithEmailAndPassword(email, senha)
            .then( (resposta) => {
              firebase.auth()
                      .currentUser
                      .getIdToken()
                      .then( (idToken: string) => {
                        this.token_id = idToken
                        localStorage.setItem('idToken', idToken )
                        this.router.navigate(['/home'])
                      })
            })
            .catch( (erro) => console.log(erro) );
  }

  public autenticado(): boolean {

    if( this.token_id === undefined && localStorage.getItem('idToken')){
        this.token_id = localStorage.getItem('idToken')
    }

    if(this.token_id === undefined){
      this.router.navigate(['/'])
    }
    return this.token_id !== undefined

  }

  public sair(): void {
    firebase.auth()
            .signOut()
            .then( () => {
                localStorage.removeItem('idToken')
                this.token_id = undefined
                this.router.navigate(['/'])
            })

  }
}
