import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { calculatingRemainingCharacters, TEXT_CHARS_LIMIT, variableList } from 'app/chatbot-design-studio/utils';
import { SatPopover } from '@ncstate/sat-popover';
import { LoggerService } from 'app/services/logger/logger.service';

@Component({
  selector: 'cds-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class CDSTextareaComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild("addVariable") addVariable: SatPopover;

  @Input() text: string;
  @Input() limitCharsText: number = TEXT_CHARS_LIMIT;
  @Input() textMessage: string;
  @Input() control: FormControl = new FormControl();
  @Input() showUtils: boolean = true;
  @Input() emoijPikerBtn: boolean = true;
  @Input() setAttributeBtn: boolean = true;
  @Input() textLimitBtn: boolean = true;
  
  @Output() onChange = new EventEmitter();
  @Output() onSelected = new EventEmitter();
  // Textarea //
  leftCharsText: number;
  alertCharsText: boolean;
  elTextarea: HTMLInputElement;

  addWhiteSpaceBefore: boolean;
  cannedResponseMessage: string;
  texareaIsEmpty = false;

  
  constructor(
    private logger: LoggerService,
  ) { }

  ngOnInit(): void {
    if (this.text) {
      this.control.patchValue(this.text)
    } else {
      this.text = this.control.value
    }

    this.leftCharsText = calculatingRemainingCharacters(this.text, this.limitCharsText);
    if (this.leftCharsText < (this.limitCharsText / 10)) {
      this.alertCharsText = true;
    } else {
      this.alertCharsText = false;
    }
  }

   /** */
   onChangeTextarea(event) {
    console.log('[CDS-TEXAREA] onChangeTextarea-->', event)
    if (event) {
      this.leftCharsText = calculatingRemainingCharacters(this.text, this.limitCharsText);
      if (this.leftCharsText < (this.limitCharsText / 10)) {
        this.alertCharsText = true;
      } else {
        this.alertCharsText = false;
      }
     


      if (event && event.length > 0) {
        this.texareaIsEmpty = false;
      } else {
        // this.texareaIsEmpty = true;
      }

      if (/\s$/.test(event)) {

        console.log('[CDS-TEXAREA] - onChangeTextarea - string contains space at last');
        this.addWhiteSpaceBefore = false;
      } else {

        console.log('[CDS-TEXAREA] - onChangeTextarea - string does not contain space at last');

        // IS USED TO ADD A WHITE SPACE TO THE 'PERSONALIZATION' VALUE IF THE STRING DOES NOT CONTAIN SPACE AT LAST
        this.addWhiteSpaceBefore = true;
      }

      console.log('[CDS-TEXAREA] - event ', event.length);
      this.text = event;
      this.onChange.emit(this.text);
    }
  }

  ngAfterViewInit() {
    this.getTextArea();
  }

  getTextArea() {
    this.elTextarea = this.autosize['_textareaElement'] as HTMLInputElement;
    console.log('[CANNED-RES-EDIT-CREATE] - GET TEXT AREA - elTextarea ', this.elTextarea);
  }

  getCursorPosition() {
    const position = this.elTextarea.selectionStart
  }

  onVariableSelected(variableSelected: {name: string, value: string}) {
    console.log('variableSelectedddd', variableSelected)
    if (this.elTextarea) {
      this.insertAtCursor(this.elTextarea, '${' + variableSelected.value + '}')
      this.onChangeTextarea(this.elTextarea.value)
      this.onSelected.emit(variableSelected)
      this.addVariable.close()
    }
  }


  insertAtCursor(myField, myValue) {
    this.logger.log('[CANNED-RES-EDIT-CREATE] - insertAtCursor - myValue ', myValue);

    if (this.addWhiteSpaceBefore === true) {
      myValue = ' ' + myValue;
      this.logger.log('[CANNED-RES-EDIT-CREATE] - GET TEXT AREA - QUI ENTRO myValue ', myValue);
    }

    //IE support
    if (myField.selection) {
      myField.focus();
      let sel = myField.selection.createRange();
      sel.text = myValue;
      // this.cannedResponseMessage = sel.text;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      this.logger.log('[CANNED-RES-EDIT-CREATE] - insertAtCursor - startPos ', startPos);

      var endPos = myField.selectionEnd;
      this.logger.log('[CANNED-RES-EDIT-CREATE] - insertAtCursor - endPos ', endPos);

      myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

      // place cursor at end of text in text input element
      myField.focus();
      var val = myField.value; //store the value of the element
      myField.value = ''; //clear the value of the element
      myField.value = val + ' '; //set that value back. 

      this.cannedResponseMessage = myField.value;

      this.texareaIsEmpty = false;
      // myField.select();
    } else {
      myField.value += myValue;
      this.cannedResponseMessage = myField.value;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPress(event) {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 27) { // Esc keyboard code
      this.addVariable.close()
    }
  }
  

}