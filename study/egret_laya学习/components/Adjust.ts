/**
 *
 * @author 
 *
 */
class Adjust extends eui.Component{
    public adjust_minus:eui.Image;
    public adjust_plus: eui.Image;
    public adjust_val: FontStyle;
    private _max: number;
    private _min: number = 0;
    private _value:number;
    private _step:number = 1;
    
    private callback: Array<any> = [];
    
	public constructor() {
        super();
	}
	public set value( val:any ){
	    this._value = Number(val);
        this.adjust_val.label = this._value.toString();
	}
	public get value():any{
        return this._value;
	}
    public set max(val: any){
        this._max = Number(val);
	}
    public set min(val: any) {
        this._min = Number(val);
    }
    public set step(val: any) {
        this._step = Number(val);
    }
    protected measure(){
        super.measure();
    }
    protected updateDisplayList(unscaledWidth: number,unscaledHeight: number): void {
        super.updateDisplayList(unscaledWidth,unscaledHeight);
    } 
    protected childrenCreated(): void {
        super.childrenCreated();
        this.adjust_val.label = this._value.toString();
        if( !this._max ){
            this._max = this._value;
        }
        this.adjust_plus.addEventListener(egret.TouchEvent.TOUCH_TAP,this.adjustPlus,this);
        this.adjust_minus.addEventListener(egret.TouchEvent.TOUCH_TAP,this.adjustMinus,this);
    }
    public setCallbackFuc( callback: Function,thisObject: any ){
        this.callback[0] = callback;
        this.callback[1] = thisObject ? thisObject : this;
        this.callback[2] = this;
    }
    public adjustPlus(){
        var max = ConstAdjust.dispatcher ? ConstAdjust.max: this._max;
        var value = ConstAdjust.dispatcher ? ConstAdjust.value : this._value;
        if( value + this._step <= max ){
            this._value += this._step;
            
            if( ConstAdjust.dispatcher ){
                ConstAdjust.value += this._step;
            }
            this.changeValue();
        }
    }
    public adjustMinus() {
        if(this._value - this._step >= this._min) {
            this._value -= this._step;
            if(ConstAdjust.dispatcher) {
                ConstAdjust.value -= this._step;
            }
            this.changeValue();
        }
    }
    public changeValue(){
        this.adjust_val.label = this.value;
        if(this.callback.length > 0) {
            this.callback[0].call(this.callback[1],this.callback[2]);
        }
        if( ConstAdjust.dispatcher ){
            ConstAdjust.dispatcher.changeValue( this.value );
        }
    }
    $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        this.adjust_plus.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.adjustPlus,this);
        this.adjust_minus.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.adjustMinus,this);
    }
}
