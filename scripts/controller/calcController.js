class calcController{
    constructor(){
        this._displayCalc = "0";
        this._currentDate;
        this.initialize();
    }
    initialize(){
        let displayCalcEl = document.querySelector('#display');
        let dateEl = document.querySelector("#data");
        let timeEl = document.querySelector("#hora");

        displayCalcEl.innerHTML = "teste";
        dateEl.innerHTML = '03/05/2021';
        timeEl.innerHTML = '18:39';
    }
    get displayCalc(){
        return this._displayCalc;
    }
    get currentDate(){
        return this._currentDate;
    }
    set displayCalc(value){
        this._displayCalc = value;
    }
    set currentDate(value){
        this.currentDate = value;
    }
}