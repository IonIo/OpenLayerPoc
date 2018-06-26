import { Injectable } from '@angular/core';
import { Action, Actions } from './../common/actions';

import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionsBusService {
  private message$: Subject<Action>

  constructor() {
    this.message$ = new Subject<Action>();
  }

  public publish<T extends Actions>(message: T): void {
    const name = (<any>message.constructor).name;
    this.message$.next({ name: name, payload: message });
  }

  public of<T extends Actions>(messageType: { new(...args: any[]): T }): Observable<T> {
    const channel = (<any>messageType).name;
    return this.message$.pipe(filter(data => data.name === channel), map(m => m.payload))
  }
}
