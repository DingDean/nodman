import {bootstrap} from '@angular/platform-browser-dynamic';
//import {HTTP_PROVIDERS, XHRBackend} from '@angular/http';
// import {enableProdMode} from '@angular/core';


import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {App} from './app/app';

// enableProdMode()

bootstrap(App, [
    //HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS
])
.catch(err => console.error(err));
