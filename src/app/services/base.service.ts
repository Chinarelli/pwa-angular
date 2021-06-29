import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { OnlineOfflineService } from 'src/app/services/online-offline.service';
import { Observable } from 'rxjs';

export abstract class BaseService<T extends {id: string}> {

  private db: Dexie = <any>[];
  private table: Dexie.Table<T, any> = <any>[];

  protected http: HttpClient = <any>[];
  protected onlineOfflineService: OnlineOfflineService = <any>[];

  constructor(
    protected injector: Injector,
    protected nomeTable: string = "",
    protected urlApi: string
  ) { 
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);

    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
  }

  private iniciarIndexedDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      [this.nomeTable]: 'id'
    });
    this.table = this.db.table(this.nomeTable);
  }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlApi, tabela)
    .subscribe(
      () => alert('tabela Cadastrado com sucesso'),
      (err) => console.log('Erro ao cadastrar tabela')
    );
  }

  private async salvarIndexedDb(tabela: T) {
    try {
      await this.table.add(tabela);
      const todostabelas: T[] = await this.table.toArray();
      console.log('tabela salvo no DB Local.', todostabelas);
    } catch(error) {
      console.log('Erro ao incluir tabela no DB Local', error);
    }     
  }

  private async enviarIdexedDBParaAPI() {
    try {
      const todostabelas: T[] = await this.table.toArray();
      for(const tabela of todostabelas) {
        this.salvarAPI(tabela);
        await this.table.delete(tabela.id);
        console.log(`tabela ID: ${tabela.id}, excluido com sucesso!`);
      }
    } catch(error) {
      console.log('Erro ao enviar dados do DB Local para a API.')
    }
  }

  public salvar(tabela: T) {
    if (this.onlineOfflineService.isOnline) {
      this.salvarAPI(tabela)
    } else {
      this.salvarIndexedDb(tabela);
    }
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.urlApi)
  }

  private ouvirStatusConexao() {
    this.onlineOfflineService.statusConexao
      .subscribe((online : boolean) => {
        if (online) {
          this.enviarIdexedDBParaAPI();
        } else {
          console.log('Estou Offline')
        }
      })
  }
}
