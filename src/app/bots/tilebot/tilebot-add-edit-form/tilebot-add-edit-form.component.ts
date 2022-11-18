import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'appdashboard-tilebot-add-edit-form',
  templateUrl: './tilebot-add-edit-form.component.html',
  styleUrls: ['./tilebot-add-edit-form.component.scss']
})
export class TilebotAddEditFormComponent implements OnInit {  

  @Output() closeAddEditForm = new EventEmitter();
  @Output() saveAddEditForm = new EventEmitter();
  @Input() displayAddForm: boolean;
  @Input() displayEditForm: boolean;
  @Input() field: any;


  langDashboard = 'En';
  showForm = false;
  nameResult = true;
  labelResult = true;
  regexResult = true;
  errorLabelResult = true;
  showRegexField = false;
  displayInfoMessage = false;

  customRGEX = /^.{1,}$/;
  textRGEX = /^.{1,}$/;
  phoneRGEX = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
  nameRGEX = /^[a-zA-Z0-9_]{1,}$/;
  emailRGEX = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  modelsOfType = ["text", "email", "number", "custom"];
  infoMessages = {}
  infoMessage: string;

  fieldName: string = '';
  fieldType: string = 'text';
  fieldRegex: string = '';
  fieldLabel: string = '';
  fieldErrorLabel: string = '';


  constructor(
    private translate: TranslateService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    // console.log('ngOnInit::: ', this.showForm);
    if(this.displayAddForm){
      this.field = {
        "name": "",
        "type": "text",
        "regex": "",
        "label": "",
        "errorLabel": ""
      }
    } else if(this.displayEditForm){
      if(this.field.regex && this.field.type === "custom"){
        this.customRGEX = this.field.regex;
        this.showRegexField = true;
      }
      this.fieldName = this.field.name;
      this.fieldType = this.field.type;
      this.fieldRegex = this.field.regex;
      this.fieldLabel = this.field.label;
      this.fieldErrorLabel = this.field.errorLabel;
    }
    this.getCurrentTranslation();
    this.infoMessage = this.infoMessages['field_name'];
  }

  ngAfterViewInit(){
    this.showForm = false;
    if(this.displayAddForm || this.displayEditForm){
      setTimeout(() => {
        this.showForm = true;
      }, 100);
    }
  }
  

  // FUNCTIONS //
  /** */
  getCurrentTranslation() {   
    if(this.translate.currentLang){
      this.langDashboard = this.translate.currentLang;
    }
    let jsonWidgetLangURL = 'assets/i18n/'+this.langDashboard+'.json';
    this.httpClient.get(jsonWidgetLangURL).subscribe(data =>{
      this.infoMessages = data['AddIntentPage'].InfoMessages;
    })
  }

  /** */
  checkFields(){

    this.nameResult = true;
    this.labelResult = true;
    this.errorLabelResult = true;
    let status = true;

    this.field.name = this.fieldName?this.fieldName:'';
    this.field.type = this.fieldType?this.fieldType:'';
    this.field.regex = this.fieldRegex?this.fieldRegex:this.customRGEX;
    this.field.label = this.fieldLabel?this.fieldLabel.trim():'';
    this.field.errorLabel = this.fieldErrorLabel?this.fieldErrorLabel.trim():'';
    switch (this.field.type) {
      case 'email':
        this.field.regex = this.emailRGEX;
        break;
      case 'number':
        this.field.regex = this.phoneRGEX;
        break;
      case 'custom':
          this.field.regex = this.fieldRegex;
          break;
      default:
        this.field.regex = this.textRGEX;
    }
    this.nameResult = this.nameRGEX.test(this.field.name);
    if(this.nameResult === false){
      status = false;
    }
    if(this.field.name.length == 0){
      this.nameResult = false;
      status = false;
    }
    if(this.field.label.length == 0){
      this.labelResult = false;
      status = false;
    }
    if(this.field.regex.length == 0 && this.field.type === 'custom'){
      this.regexResult = false;
      status = false;
    }
    this.field.regex = this.field.regex.toString();
    return status;
  }


  // ON EVENT //
  /** */
  onChangeParameterName(parameterName){
    parameterName.toString();
    this.fieldName = parameterName.replace(/[^A-Z0-9_]+/ig, "");
  }

  /** */
  onChange(typeFieldValue) {
    if(typeFieldValue === 'custom'){
      this.field.regex = this.customRGEX;
      this.showRegexField = true;
    } else {
      this.showRegexField = false;
    }
  }

  displayMessage(field){
    if(this.infoMessages[field]){
      this.infoMessage = this.infoMessages[field];
      this.displayInfoMessage = true;
    }
  }

  save(){
    if(this.checkFields()){
      this.displayInfoMessage = false;
      this.showForm = false;
      this.saveAddEditForm.emit(this.field);
    }
  }

  close() {
    this.displayAddForm = false;
    this.displayEditForm = false;
    this.showForm = false;
    this.displayInfoMessage = false;
    this.closeAddEditForm.emit();
  }

}
