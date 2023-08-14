import { NgForm } from "@angular/forms"; 
export class InputService {
    constructor(){

    }
    editInput(component: any, currentInput){
        console.log("the current input", currentInput);
        component.input = { ...currentInput };
        component.inputBeingEdited = currentInput;
        component.editing = true;
    }

    resetForm(component: any, form: NgForm) {
        component.review = {};
        component.editing = false;
        component.reviewBeingEdited = undefined;
      }
      
}