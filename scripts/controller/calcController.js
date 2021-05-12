class calcController{
    constructor(){
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._operation = [];
        this._lastOperator = '+';
        this._lastNumber = 0;
        this._wasPercent;
        this.lang = "pt-BR";
        this.initialize(); 
        this.initButtonEvens(); 
    }
    initialize(){
        this._displayCalcEl.innerHTML = "0";
        this.defineTime(); 
        setInterval(()=>{   
            this.defineTime();
        }, 1000); 
    }
    defineTime(){
        this._dateEl.innerHTML = this.displayDate.toLocaleDateString(this.lang, {
            day: "2-digit",
            month: "long", 
            year: "numeric"
        });
        this._timeEl.innerHTML = this.displayTime.toLocaleTimeString(this.lang);
    }
    addEventListenerAll(element, event, fn){
        event.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        }); 
    }
    clearAll(){
        this._operation = [];
        this.displayCalc = '0';
    }
    clearEntry(){
        this._operation.pop();
        switch(true){
            case this._operation.length === 0:
                this.displayCalc = '0';
                break;
            case this._operation.length === 1:
                this.displayCalc = this._operation;
                break;
            case this._operation.length === 2:
                this._operation.pop();
                this.displayCalc = this._operation;
                break;
            default:
                this._operation = [];
                this.displayCalc = '0';
        }
    }
    MyScreen(showingMethod){
        if(showingMethod){
            for (let i = this._operation.indexOf(this.LastOperation); i > -1; i--){
                if (!isNaN(this._operation[i])){
                    this.displayCalc = this._operation[i];
                    break;
                }
            }
        }
        else this.displayCalc = this._operation.join("");
    }
    equalOperation(value){
        if(this._operation.length == 1){
            if (!this._wasPercent){
                var myResult = eval(`${this._operation[0]} ${this._lastOperator} ${this._lastNumber}`);
            }
            else{
                if (this._lastOperator == '+'){
                    var myResult = this._operation[0]*this._lastNumber/100;
                    myResult = this._operation[0] + myResult;
                }
                if (this._lastOperator == '-'){
                    var myResult = this._operation[0]*this._lastNumber/100;
                    myResult = this._operation[0] - myResult;
                }
                if (this._lastOperator == '*'){
                    var myResult = this._operation[0]*this._lastNumber/100;
                }
                if (this._lastOperator == '/'){
                    var myResult = this._operation[0]*this._lastNumber/100;
                    myResult = this._operation[0] / myResult;
                }
            }
            this._operation = [myResult];
        }
        else {
            if (value === '%'){ 
                this._wasPercent = true;
                if (this._operation[1] == '+'){
                    var myResult = this._operation[0]*this._operation[2]/100;
                    myResult = this._operation[0] + myResult;
                }
                if (this._operation[1] == '-'){
                    var myResult = this._operation[0]*this._operation[2]/100;
                    myResult = this._operation[0] - myResult;
                }
                if (this._operation[1] == '*'){
                    var myResult = this._operation[0]*this._operation[2]/100;
                }
                if (this._operation[1] == '/'){
                    var myResult = this._operation[0]*this._operation[2]/100;
                    myResult = this._operation[0] / myResult;
                }
                this._lastNumber = this._operation[2];
                this._lastOperator = this._operation[1];
                this._operation = [myResult];
            } 
            else{
                this._wasPercent = false;
                let myResult = eval(`${this._operation[0]} ${this._operation[1]} ${this._operation[2]}`);
                this._lastNumber = this._operation[2];
                this._lastOperator = this._operation[1];
                this._operation = [myResult];
                if (value !== '=') this.pushOperation(value);
            }
        }
        this.MyScreen(false); //Doesn't matter
    }
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3) this.equalOperation(value);
    }
    isOperator(value){
        return ['+', '-', '*', '/', '%'].indexOf(value) > -1;
    }
    addOperation(value){
        if(isNaN(this.LastOperation)){ 
            if(this.isOperator(value)){ 
                this.LastOperation = value;
            }
            else { 
                this.pushOperation(value);
            }
        }
        else if(!isNaN(value)){ 
            let newValue = this.LastOperation.toString() + value.toString();
            this.LastOperation = parseInt(newValue);
        }
        else { 
            this.pushOperation(value);
        }
        this.MyScreen(false);
    }
    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                if(this._operation.length >= 3 || this._operation.length == 1) this.equalOperation('=');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.displayCalc = "ERR";
        }
    }
    initButtonEvens(){
        let myButtons = document.querySelectorAll("#buttons > g, #parts > g");
        myButtons.forEach(btn => {
            this.addEventListenerAll(btn, "click drag", e => {
                let btnText = btn.className.baseVal.replace('btn-', '');
                this.execBtn(btnText);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = 'pointer';
            });
        })
    }
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    get displayTime(){
        return new Date();
    }
    get displayDate(){
        return new Date();
    }
    get LastOperation(){
        return this._operation[this._operation.length - 1]; 
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
    set LastOperation(value){
        this._operation[this._operation.length - 1] = value; 
    }
}