import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TYPE_MATH_OPERATOR } from 'app/chatbot-design-studio/utils';
import { Operand, Operation } from 'app/models/intent-model';

@Component({
    selector: 'operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {

    @Input() operation: Operation;
    @Output() onAddOperator = new EventEmitter<any>();
    list: Array< TYPE_MATH_OPERATOR | Operand | ''> = [];


    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes) {        
        if (this.operation) {
            this.setList(this.operation);
        }
    }

    private setList(operation: Operation) {
        this.list = [];


        for (let i = 0; i < operation.operands.length; i++) {
            this.list.push(operation.operands[i]);

            if (i < operation.operands.length - 1) {
                this.list.push(operation.operators[i]);
            }
        }
    }

    onClickOperator() {
        this.onAddOperator.emit();
    }

    onSelectedOperator(event: any, index: number) {
        this.list[index] = TYPE_MATH_OPERATOR[event.value];

        index = Math.floor(index / 2);
        this.operation.operators[index] = TYPE_MATH_OPERATOR[event.value];
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
