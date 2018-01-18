
import VerticalAlign = egret.VerticalAlign;
/**
 * 公共按钮
 * @alpen   3.23
 *
 */
class MyButton extends eui.Button {
    public data:any;

    private _lanId:string = "";
    private _tip:string;
    private _label2:string;
    private _fontStyle:string;
    private _mc: egret.MovieClip;  //动画对象

    public isGrayTipButton:boolean;
    public icoPic: eui.Image;
    public constructor() {
        super();
        this.touchChildren=false;

//        this.canvas = document.getElementsByTagName("CANVAS")[0];
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    public set lanId(v: string) {
        if(this._lanId == v){
            return;
        }

        this._lanId = v;

        if(this.labelDisplay instanceof FontStyle){
            var fs = (this.labelDisplay as FontStyle);
            fs.lanId = this._lanId;
        }
        this.invalidateProperties();
    }

    public get lanId(): string {
        return this._lanId;
    }
    protected onTouchEnd(event:egret.TouchEvent){
        App.SoundManager.playEffect("sound_button6_mp3");
    }

    $onRemoveFromStage():void {
        super.$onRemoveFromStage();
        this.removeEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this);

    }

    protected childrenCreated():void {
        super.childrenCreated();

        if(this.labelDisplay instanceof FontStyle){
            var fs = (this.labelDisplay as FontStyle);
            fs.lanId = this._lanId;
            fs.label= this._label2;
            // fs.fontStyle = this._fontStyle;
        }else{
            if(this.labelDisplay){
                this.labelDisplay.text = this._label2;
            }
        }


        this.touchEnabled = true;
    }


    protected commitProperties():void {
        super.commitProperties();
    }

    protected measure():void {
        super.measure();
    }

    protected updateDisplayList(unscaledWidth: number,unscaledHeight: number): void {
        super.updateDisplayList(unscaledWidth,unscaledHeight);
    }

    public set label(v:string){
        if(this._label2 == v){
            return;
        }

        this._label2 = v;
        if(this.labelDisplay instanceof FontStyle){
            var fs = (this.labelDisplay as FontStyle);
            fs.label= this._label2;
        }else{
            if(this.labelDisplay){
                this.labelDisplay.text = this._label2;
            }
        }
        this.invalidateProperties();

    }

    ///---加一个特殊需求，按钮灰化，可以点击出个提示
    public grayButtontip(tip:string = null):void{
        this.isGrayTipButton=true;
        this.currentState ="disabled";
        this.invalidateDisplayList();
        this._tip=tip;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.grayShowTip,this);
    }
    private grayShowTip():void{
        if(this._tip && this._tip != "")
        CommonTipManager.instance.shopTip(this._tip);
    }
    public destory():void{
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.grayShowTip,this);
    }
    
    public enableGrayBtn():void{
        this.isGrayTipButton=false;
        this.destory();
        this.currentState = "";
        this.enabled=true;
        this.invalidateDisplayList();
    }
    //设置按钮为正常状态
    public setUp(){
        this.isGrayTipButton = false;
        this.currentState = "up";
        this.invalidateDisplayList();
        this._tip = null;
    }
    //为按钮增加一个扫光的动画
    public addEffectOfFlash(num: number = 1): void{
        if (!this._mc) {
            this._mc=MovieClipFactory.getInstance().createMovieClip(EnumAniType.btn_light);
            this._mc.y = 4;
            this._mc.x = -1;
            this.addChild(this._mc);
            this._mc.play(num);
        }
    }

    //停止扫光动画
    public stopEffectOfFlash() {
        if (this._mc) {
            this.removeChild(this._mc);
            this._mc = null;
        }
    }    

}
   
