import { Component, OnInit, Input, Output, HostBinding, HostListener, EventEmitter } from '@angular/core';

import { DataService } from '../../../services/data/data.service';
import { DataComponent } from '../data.component';

@Component({
  	selector: 'ma-data-detail',
  	templateUrl: './data-detail.component.html',
  	styleUrls: ['./data-detail.component.styl'],
  	providers: [
		DataService
	]
})
export class DataDetailComponent implements OnInit {
	/********************/
	/* Входные значения */
	/********************/
	@Input() dataItem: DataComponent;
	@Input() dataList: DataComponent[];
	@Input() dragInProcess: boolean = false;

	/*********************/
	/* Выходные значения */
	/*********************/
  	@Output() toogleFullscreen = new EventEmitter();
  	@Output() delete = new EventEmitter();
  	@Output() childCreated = new EventEmitter();

	/****************************/
	/* Инициализация переменных */
	/****************************/
	showCreateList: boolean = false;	
	showParentList: boolean = false;
	draggableGroup = null;
	draggableField = null;
	parent = null;
	tempDataX;
	tempDataY;
	tempData = {
		coordinates: null
	};

	/***********************/
	/* Обработчики событий */
	/***********************/
	@HostListener('mouseup', ['$event']) mouseUp(e) {
  		if (this.draggableGroup) {
  			e.preventDefault();
	  		this.draggableGroup = null;
		}
		if (this.draggableField) {
  			e.preventDefault();
	  		this.draggableField = null;
		}
  	}
	constructor(
		private dataService: DataService
	){}

	/*********************/
	/* Методы компонента */
	/*********************/
	watchOpen(event) {
		this.tempData.coordinates = {
			x: this.dataItem.coordinates.x,
			y: this.dataItem.coordinates.y
		}
		this.toogleFullscreen.emit(this.dataItem.fullScreen);
	}

	resolveOpen(event) {
		if (this.tempData.coordinates.x === this.dataItem.coordinates.x && 
			this.tempData.coordinates.y === this.dataItem.coordinates.y) {
			this.dataItem.fullScreen = true;
			this.toogleFullscreen.emit(this.dataItem.fullScreen);
		}
	}

	updateData(data: DataComponent): void {
	    this.dataService.update(data)
	      	.subscribe(data => {
 	       		this.dataItem = data;
 	     	});
	}

	approve() {
		this.dataItem.fullScreen = false;
		this.updateData(this.dataItem);
		this.toogleFullscreen.emit(this.dataItem.fullScreen);
	}

	declane() {
		this.dataItem.fullScreen = false;
		this.toogleFullscreen.emit(this.dataItem.fullScreen);
	}

	addField(groupId: number, type: string) {
		this.dataItem.content[groupId].fields.push({
			type: type,
			value: "",
			order: 0
		});
		this.showCreateList = false;
	}

	addGroup() {
		this.dataItem.content.push({
			name: "",
			order: 0,
			fields: []
		});
		// this.updateData(this.data);
	}

	deleteData(data: DataComponent) {
		this.delete.emit(true);
	}

	deleteField(groupId: number, fieldId: number) {
		delete this.dataItem.content[groupId].fields[fieldId];
		// this.updateData(this.data);
	}

	deleteGroup(groupId: number) {
		delete this.dataItem.content[groupId];
		// this.updateData(this.data);
	}

	fieldOrderUp(groupId: number, fieldId: number) {
		// this.data.content[groupId].fields[fieldId].order++;
		if (this.dataItem.content[groupId].fields[fieldId-1]) {
			this.dataItem.content[groupId].fields[fieldId].order = this.dataItem.content[groupId].fields[fieldId-1].order - 1;
		}
	}

	fieldOrderDown(groupId: number, fieldId: number) {
		// this.data.content[groupId].fields[fieldId].order--;
		if (this.dataItem.content[groupId].fields[fieldId+1]) {
			this.dataItem.content[groupId].fields[fieldId].order = this.dataItem.content[groupId].fields[fieldId+1].order + 1;
		}		
	}

	dragGroup(event, group) {
		if (!this.draggableGroup) {
			event.preventDefault();
			this.draggableGroup = group;
		}
	}

	swapGroupOrder(event, group) {
		if (this.draggableGroup) {
			event.preventDefault();
			if (this.draggableGroup.order === group.order) {
				this.draggableGroup.order++;
			} else {
				let temp = this.draggableGroup.order;
				this.draggableGroup.order = group.order;
				group.order = temp;
			}
			
		}
	}

	dragField(event, field) {
		console.log(event, field);
		if (!this.draggableField) {
			event.preventDefault();
			this.draggableField = field;
		}
	}

	swapFieldOrder(event, field) {
		if (this.draggableField) {
			event.preventDefault();
			if (this.draggableField.order === field.order) {
				this.draggableField.order++;
			} else {
				let temp = this.draggableField.order;
				this.draggableField.order = field.order;
				field.order = temp;
			}
			
		}
	}

	deleteParent(event) {
		this.dataItem.parent = null;
		this.toogleFullscreen.emit(this.dataItem.fullScreen);
	}

	createChild() {
		this.dataService
			.create('Без имени', this.dataItem.project)
			.subscribe((data: DataComponent) => {
				data.coordinates.x = this.dataItem.coordinates.x;
				data.coordinates.y = this.dataItem.coordinates.y + 130;
				data.parent = this.dataItem.id;
				this.childCreated.emit(data);
			});
		this.toogleFullscreen.emit(this.dataItem.fullScreen);
	}

	/****************************/
	/* Инициализация компонента */
	/****************************/
	ngOnChanges() {
		this.parent = this.dataList.find((value: DataComponent) => {
			return value.id === this.dataItem.parent
		});
		this.parent = this.parent ? this.parent : {};
	}

  	ngOnInit() {
  		this.dataItem.coordinates.x = this.dataItem.coordinates.x ? this.dataItem.coordinates.x : (document.getElementsByClassName('dataList')[0].scrollWidth / 2) - 50;
  		this.dataItem.coordinates.y = this.dataItem.coordinates.y ? this.dataItem.coordinates.y : (document.getElementsByClassName('dataList')[0].scrollHeight / 2) - 50;
  	}
}