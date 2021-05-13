class calcController{
    constructor(){
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._operation = [0];
        this._lastOperator = '+';
        this._lastNumber = 0;
        this._wasPercent;
        this._soundOnOff = false;
        this._clickSound = new Audio('click.mp3');
        this.control = 0;
        this.showingMethod; //Defined in UserPreferences area
        this.lang; //Defined in UserPreferences area
        this.initialize(); 
        this.initButtonEvens();
        this.initKeyBoard(); 
    }
    initialize(){
        this._displayCalcEl.innerHTML = "0";
        this.defineTime(); 
        setInterval(()=>{   
            this.defineTime();
        }, 1000); 
    }
    initButtonEvens(){
        let myButtons = document.querySelectorAll("#buttons > g, #parts > g");
        myButtons.forEach(btn => {
            this.addEventListenerAll(btn, "click drag", () => {
                let btnText = btn.className.baseVal.replace('btn-', '');
                this.execMyCommand(btnText);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', () => {
                btn.style.cursor = 'pointer';
            });
        })
    }
    initKeyBoard(){
        addEventListener('paste', event =>{
            this.addOperation(parseFloat(event.clipboardData.getData('text')));
        })
        addEventListener('keyup', event =>{
            this.execMyCommand(event.key);
            switch(event.ctrlKey){
                case true:
                    this.myClipboard(event.key);
                    break;
            }
        })
    }
    defineTime(){
        this._dateEl.innerHTML = this.displayDate.toLocaleDateString(this.lang, {
            day: "2-digit",
            month: "long", 
            year: "numeric"
        });
        this._timeEl.innerHTML = this.displayTime.toLocaleTimeString(this.lang);
    }
    playSound(play){
        if(play) {
            this._clickSound.currentTime = 0;
            this._clickSound.play();
        }
    }
    toggleSound(){
        this.control++;
        setTimeout(() => {
            this.control = 0;
        }, 250)
        if(this.control >= 2){
            this._soundOnOff = !this._soundOnOff;
            this.playSound(this._soundOnOff);
            this.control = 0;
        }
    }
    addEventListenerAll(element, event, fn){
        event.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        }); 
    }
    myClipboard(key){
        const input = document.createElement('input');
        switch(key){
            case 'c':
            case 'C':
                input.value = this.displayCalc;
                document.body.appendChild(input);
                input.select();
                document.execCommand('Copy');
                input.remove();
                break;
            case 'x':
            case 'X':
                input.value = this.displayCalc;
                this.clearEntry();
                document.body.appendChild(input);
                input.select();
                document.execCommand('Copy');
                input.remove();
                break;
            case 'v':
            case 'V':
                input.remove();
                break;
            default:
                input.remove();
                console.error(`Command Ctrl+${key} not supported`);
        }
    }
    clearAll(){
        this._operation = [0];
        this._lastOperator = '+';
        this._lastNumber = 0;
        this.displayCalc = '0';
    }
    clearEntry(){
        this._operation.pop();
        switch(true){
            case this._operation.length === 0:
                this.displayCalc = '0';
                this._operation = [0]
                break;
            case this._operation.length === 1:
                this.displayCalc = this._operation;
                break;
            case this._operation.length === 2:
                this._operation.pop();
                this.displayCalc = this._operation;
                break;
            default:
                this._operation = [0];
                this.displayCalc = '0';
        }
    }
    MyScreen(showingMethod){
        if(showingMethod){
            for (let i = this._operation.indexOf(this.lastOperation); i > -1; i--){
                if (!isNaN(this._operation[i])){
                    this.displayCalc = this._operation[i];
                    break;
                }
            }
        }
        else if(this._operation.length > 0) this.displayCalc = this._operation.join("");
        else this.displayCalc = '0';
    }
    equalOperation(value){
        try{
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
                this._operation[0] = parseFloat(this._operation[0]);
                this._operation[2] = parseFloat(this._operation[2]);
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
        }
        catch(error){
            setTimeout(()=>{
                this.displayCalc = 'ERR';
            }, 1);
        }
        this.MyScreen(this.showingMethod); //Doesn't matter
    }
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3) this.equalOperation(value);
    }
    isOperator(value){
        return ['+', '-', '*', '/', '%'].indexOf(value) > -1;
    }
    addDot(){
        if(!this.lastOperation.toString().split('').includes('.')){
            if (this.isOperator(this.lastOperation)){
                this.pushOperation('0.'); 
            }   
            else this.lastOperation = this.lastOperation.toString() + '.';
        }
        this.MyScreen(this.showingMethod);
    }
    addOperation(value){
        if(isNaN(this.lastOperation)){ 
            if(this.isOperator(value)){
                this.lastOperation = value;
            }
            else if(value == '.') var newValue = this.lastOperation.toString() + value.toString();
            else this.pushOperation(value);
        }
        else if(!isNaN(value)){ 
            if(this.lastOperation != 0 || this.lastOperation.toString().split('').includes('.')){
                var newValue = this.lastOperation.toString() + value.toString();
            }
            else{
                var newValue = value.toString();
            }
            this.lastOperation = newValue;
        }
        else { 
            this.pushOperation(value);
        }
        this.MyScreen(this.showingMethod);
    }
    execMyCommand(value){
        switch(value){
            case 'ac':
            case 'Delete':
            case 'Escape':
                this.toggleSound();
                this.clearAll();
                break;
            case 'ce':
            case 'Backspace':
                this.clearEntry();
                break;
            case 'soma':
            case '+':
                this.addOperation('+');
                break;
            case 'subtracao':
            case '-':
                this.addOperation('-');
                break;
            case 'divisao':
            case '/':
                this.addOperation('/');
                break;
            case 'multiplicacao':
            case '*':
                this.addOperation('*');
                break;
            case 'porcento':
            case '%':
                this.addOperation('%');
                break;
            case 'ponto':
            case '.':
            case ',':
                this.addDot();
                break;
            case 'igual':
            case '=':
            case 'Enter':
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
                this.addOperation(value);
                break;
        }
        this.playSound(this._soundOnOff);
    }
    roundValue = function(num) {
        if(num > 0) var decimalPlaces = 3;
        else var decimalPlaces = 4;
        num = num.toString().split('');
        let myNum = [];
        let i = 0;
        if(num[decimalPlaces] >= 5) num[decimalPlaces - 1]++;
        while (i < decimalPlaces){
            myNum.push(num[i])
            i++;
            if(num[i] === undefined) break;
        }
        return parseFloat(myNum.join(""));
    };
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    get displayTime(){
        return new Date();
    }
    get displayDate(){
        return new Date();
    }
    get lastOperation(){
        return this._operation[this._operation.length - 1]; 
    }
    set displayCalc(value){
        if(value.toString().length <= 10) this._displayCalcEl.innerHTML = value;
        else if(value <= 9999999999){
            this._displayCalcEl.innerHTML = this.roundValue(value);
        } 
        else if(value > 9999999999) this._displayCalcEl.innerHTML = 'Math error';
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
    set lastOperation(value){
        this._operation[this._operation.length - 1] = value; 
    }
}
