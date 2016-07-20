import { provideRouter, RouterConfig } from '@angular/router';

import {ControlPanelComponent} from './components/control-panel/control-panel.component.ts';

const routes: RouterConfig = [
    {path: '', component: ControlPanelComponent}
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
