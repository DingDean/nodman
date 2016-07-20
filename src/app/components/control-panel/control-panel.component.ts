import { Component, Input } from '@angular/core';
@Component({
    selector: "nodman-control-panel",
    templateUrl: "./control-panel.component.html",
    styleUrls: ["./control-panel.component.css"]
})

export class ControlPanelComponent {
    @Input() servers :string[];
    constructor() {}
}
