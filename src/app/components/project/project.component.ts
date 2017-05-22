import { Component } from '@angular/core';

@Component({
	selector: 'ma-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.styl']
})
export class ProjectComponent {
	/************************/
	/* Интерфейс компонента */
	/************************/
	id: number;
	name: string;
	pages: number;

	constructor(){}
}