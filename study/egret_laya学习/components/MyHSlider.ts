/**
 *
 * @RXHuang
 *
 */
class MyHSlider extends eui.HSlider {
    public background_img:eui.Image;
    //public thumb:eui.Button;//滑块
    public minus_btn:eui.Button;
    public plus_btn:eui.Button;
    
    private valueChangeFunc: Function;//值改变时的回调函数
    private funcObj: Object;//回调函数里this对应的对象
    private funcArgs: Array<any> = [];//回调函数里的参数，必需是数组
    
	public constructor() {
    	super();
    	//this.skinName = "resource/skins/component_skins/MyHSliderSkin.exml";
	}
	
    protected updateDisplayList(w: number,h: number) {
        super.updateDisplayList(w,h);
        //避免由于图素的问题，导致滑块前的空隙
        this.trackHighlight.width = this.thumb.x + 15;
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        //添加视图初始化逻辑
        console.log("childrenCreated");
        this.addEventListener(eui.UIEvent.CHANGE,this.valueChange,this);
        this.minus_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.valueMinus,this);
        this.plus_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.valuePlus,this);

        super.validateDisplayList();
        eui.Binding.bindHandler(this, ["maximum"], this.uu, this);
        eui.Binding.bindHandler(this, ["minimum"], this.uu, this);
    }

    $onRemoveFromStage(): void {
        super.$onRemoveFromStage();
        //添加视图销毁逻辑
        this.removeEventListener(eui.UIEvent.CHANGE,this.valueChange,this);
        this.minus_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.valueMinus,this);
        this.plus_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.valuePlus,this);
    }

    //监听最大最小值的变化，做特殊处理
    public uu(){
        if(this.minimum == -1){//锁定状态
            this.touchChildren = false;
        }else{
            //重新检测
            if(this.maximum == this.minimum){
                this.minimum = -1;
                this.value = this.maximum;
                this.touchChildren = false;
            }else{
                this.touchChildren = true;
            }
        }
    }
    
    /*设置valueChange的callback函数/执行对象/参数
     * func:MyHSlider值改变时的回调函数
     * obj:回调函数中的this对象
     * args:回调函数的参数，必需为数组
     */ 
    public setValueChangeFunc(func:Function, obj:any, args:Array<any> = []){
        this.valueChangeFunc = func;
        this.funcObj = obj;
        this.funcArgs = args;
    }
    
    //值改变时回调
    public valueChange() {
        //如果回调函数被设置，执行回调函数
        if(this.valueChangeFunc) {
            this.valueChangeFunc.apply(this.funcObj,this.funcArgs);
        }
    }
    
    //步进一个snapInterval
    public valuePlus(): void {
        if((this.value + this.snapInterval) > this.maximum) {
        } else {
            this.value = this.value + this.snapInterval;
        }
        /*//如果回调函数被设置，执行回调函数
        if(this.valueChangeFunc) {
            this.valueChangeFunc.apply(this.funcObj,this.funcArgs);
        }*/
        var event = new eui.UIEvent(eui.UIEvent.CHANGE);
        this.dispatchEvent(event);
    }
    
    //步减一个snapInterval
    public valueMinus(): void {
        console.log("valueMinus");
        if((this.value - this.snapInterval) < this.minimum) {
        } else {
            this.value = this.value - this.snapInterval;
        }
        /*//如果回调函数被设置，执行回调函数
        if(this.valueChangeFunc) {
            this.valueChangeFunc.apply(this.funcObj,this.funcArgs);
        }*/
        var event = new eui.UIEvent(eui.UIEvent.CHANGE);
        this.dispatchEvent(event);
    }
}
