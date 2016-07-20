import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import './rxjs-operator';

@Component({
  selector: 'app',
  pipes: [],
  directives: [],
  templateUrl: './app.html'
})

export class App {
    servers :string[]= [
        "TestServer",
        "TServer"
    ];
  constructor() {}
}
