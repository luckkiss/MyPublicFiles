/**
 *
 * @alpen  淡入淡出提示 
 *
 */
class CommonTipManager extends eui.Component{
    protected static _instance: CommonTipManager;
    private flag_img:eui.Image;
    private content_txt:FontStyle;
    private tipList:Array<any>;
    private isShowing:boolean;
    public static get instance() {
        if(this._instance == null) {
            this._instance = new CommonTipManager();
        }

        return this._instance;

    }
    public constructor() {
        super();
        this.isShowing=false;
        this.tipList=new Array<any>();
        this.skinName ="resource/skins/component_skins/CommonTipSkin.exml";
        this.visible = false;
        this.alpha = 0;
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.x=(App.StageUtils.getWidth()-this.width)*.5;
        this.y = (App.StageUtils.getHeight() - this.height) * .5;

    }
    //***
    //txt,提示文字，，flag 0，，错误标志  1:正确标志
    public shopTip(txt:string,flag:number=0):void{
        this.tipList=[];
        this.y = (App.StageUtils.getHeight() - this.height) * .5;
        this.com();
        this.tipList.push({"txt":txt,"flag":flag});
        this.visible=true;
        this.show();

    }
    private show():void{
        if(this.isShowing) return;
        var tem:any=this.tipList.shift();
        if(tem["flag"]==0){
            this.flag_img.source = RES.getRes("common_list_error_png");
            this.content_txt.fontStyle ="PANEL_CONTENT_RED_LABEL";
        } else if(tem["flag"] == 1){
            this.content_txt.fontStyle = "PANEL_CONTENT_ADD_LABEL";
            this.flag_img.source = RES.getRes("common_list_correct_png");
        }
        this.content_txt.label = tem["txt"];
        this.isShowing=true;
        LayerManager.UI_Tips.addChild(this);
        var tw = egret.Tween.get(this);
        tw.to({ alpha: 1 },300,egret.Ease.cubicOut);
        tw.wait(500);
        tw.to({ alpha: 0 ,y:this.y-50},300,egret.Ease.cubicIn);
        tw.call(this.com,this);
    }
    private com():void{
        egret.Tween.removeTweens(this);
        this.isShowing=false;
        this.alpha = 0;
        if(this.tipList.length==0){
            this.visible=false;

        }else{
            this.show();
        }
    }
}
