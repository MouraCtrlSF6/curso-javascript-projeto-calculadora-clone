class calcController{
    constructor(){
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
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
    initButtonEvens(){
        let myButtons = document.querySelectorAll("#buttons > g, #parts > g");
        myButtons.forEach((btn, index) => btn.addEventListener('click', () =>{
            console.log(btn.className.baseVal.replace('btn-', ''));
        }));
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
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
}