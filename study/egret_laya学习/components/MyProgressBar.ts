/**
 * 说明：切9宫格的时候，左右各留11像素，所以最小的宽度为22，小于这个
 * 宽度，都以22都宽带显示
 * @alpen
 *
 */
class MyProgressBar extends eui.Component {
    private _dataProvider:MyProgressData;

    public get dataProvider():MyProgressData {
        return this._dataProvider;
    }

    public set dataProvider(value:MyProgressData) {
        this._dataProvider = value;

        this.invalidateProperties();
    }

    public container:eui.Group;

    public static STYLE_GREEN:string = "green_png";
    //默认值
    public static STYLE_BLUE:string = "blue_png";
    public static STYLE_RED:string = "red_png";
    public static STYLE_YELLOW:string = "yellow_png";
    
    private _maxWidth:number;
    private _minWidth:number = 18;
    private _lanId:string;
    private bar_img:eui.Image;

    private num_bitmapLabel:eui.BitmapLabel;
    private bar_label:TimeLabel;

    private enterTimer:number;

    public constructor() {
        super();

        this.touchChildren = false;
    }


    protected childrenCreated():void {
        super.childrenCreated();

        if (this.container && this.container.contains(this.num_bitmapLabel)) {
            this.container.removeChild(this.num_bitmapLabel);
        }


    }


    protected commitProperties():void {
        super.commitProperties();

        if (this._dataProvider == null) {
            return;
        }

        // if(this.dataProvider.skin != null || this.dataProvider.skin != ""){
        //     this.skinName = this.dataProvider.skin;
        // }

        if (this.dataProvider.label == null) {
            this.bar_label.label = this.dataProvider.val + "/" + this.dataProvider.valMax;

        } else {
            this.bar_label.label = this.dataProvider.label;
        }

        if(this.dataProvider.style != null){
            this.bar_img.source = "common_small_progressbar_" + this.dataProvider.style;
        }

        if(this._dataProvider.fontStyle == null){
            switch(this.dataProvider.style){
                case MyProgressBar.STYLE_GREEN:
                    this.dataProvider.fontStyle = "";
                    break;
                case MyProgressBar.STYLE_BLUE:
                    this.dataProvider.fontStyle = "MY_PROGRESSBAR_LABEL_WHITE";
                    break;
                case MyProgressBar.STYLE_RED:
                    this.dataProvider.fontStyle = "MY_PROGRESSBAR_LABEL_RED";
                    break;
                case MyProgressBar.STYLE_YELLOW:
                    this.dataProvider.fontStyle = "";
                    break;
            }
        }



        if (this.dataProvider.fontStyle != null) {
            this.bar_label.fontStyle = this.dataProvider.fontStyle;
        }
        this.creatLv(this._dataProvider.level);
        this.colPercent(this.dataProvider.val, this.dataProvider.valMax);

    }

    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);

        if (this._dataProvider == null) {
            return;
        }

        this.creatLv(this._dataProvider.level)

    }

    /*curvalue:当前值
     * maxvalue:最大值
     * style:里面进度条的样式
     * lv：是否显示lv等级  如果为默认值－1就不显示
     * isflag:是否用传进来的数字作为百分比，
     */
    public init(curvalue:number, maxvalue:number, lv:string = "", style?:string) {
        if(this._dataProvider == null){
            this._dataProvider = new MyProgressData();
        }
        this.dataProvider.label=null;
        this._dataProvider.val = Number(curvalue);
        this._dataProvider.valMax = Number(maxvalue);
        this._dataProvider.level = lv;
        this._dataProvider.style = style;

        this.invalidateProperties();
    }


    public colPercent(curvalue:number, maxvalue:number):void {
        this.bar_img.visible = true;
        if (curvalue <= 0) {//当前值为0或者超过范围，都按0计算
            this.bar_img.visible = false;
        } else if (curvalue > maxvalue) {
            this.bar_img.width = this.width;
        } else {
            var percent:number = curvalue / maxvalue;
            this.bar_img.width = this.width * percent <= this._minWidth ? this._minWidth : this.width * percent;
        }

    }

    /*
     * 文字默认显示百分比，如果要显示其他文字，重新设
     */
    public setLabel(label:string, style:string = null):void {

        this._dataProvider.label = label;
        this._dataProvider.fontStyle = style;
        this.invalidateProperties();
    }

    /**
     * 设置时间，会自动倒数
     * @param lanId 语言包Id。例如"冷却中:{s0}"，{S0}为通过style生成的时间字符串
     * @param time
     * @param style 跟DateUtils的style一致
     * @param completeCall
     * @param thisObj
     * @param params
     */
    public setTime(lanId:string, time:number, style:number, completeCall:Function, thisObj:any, ...params) {
        if(this._dataProvider == null){
            this._dataProvider = new MyProgressData();
        }

        this._lanId = lanId;
        this._dataProvider.val = time + 1;
        if(this._dataProvider.valMax == -1){
            this._dataProvider.valMax = time;
        }

        App.TimerManager.remove(this.enterTimer);
        if (this.bar_label == null) {
            this.addEventListener(egret.Event.COMPLETE, function () {
                this.bar_label.setTime(this._lanId, time, style, completeCall, thisObj, ...params);
                this._dataProvider.label = this.bar_label.label;
                this.enterTimeout();
            }, this);
        } else {
            this.bar_label.setTime(lanId, time, style, completeCall, thisObj, ...params);
            this._dataProvider.label = this.bar_label.label;
            this.enterTimeout();
        }

    }

    private enterTimeout(){
        this._dataProvider.val--;
        this.colPercent(this._dataProvider.val, this._dataProvider.valMax);


        if(this._dataProvider.val > 0){
            this.enterTimer = App.TimerManager.doTimer(1000, 1, this.enterTimeout, this, null, null, true)
        }
    }




    public resetValue(value:number, maxvalue:number, lv:string = ""):void {
        this._dataProvider.val = value;
        this._dataProvider.valMax = maxvalue;
        this._dataProvider.level = lv;
        this.dataProvider.label=null;
        this.invalidateProperties();
    }

    /*
     * 加一个显示lv的方法
     */
    public creatLv(lv:string):void {
        if (lv) {
            this.container.addChildAt(this.num_bitmapLabel, 0);
            this.num_bitmapLabel.text = lv;
        } else {
            if (this.container.contains(this.num_bitmapLabel)) {
                this.container.removeChild(this.num_bitmapLabel);
            }
        }
    }

}

class MyProgressData {
    public label:string;
    public fontStyle:string;
    public val:number;
    public valMax:number = -1;
    public level:string;
    public style:string;


    constructor(val?:number, valMax?:number, style?:string, label?:string, fontStyle?:string, level?:string) {
        this.label = label;
        this.fontStyle = fontStyle;
        this.val = val;
        this.valMax = valMax;
        this.level = level;
        this.style = style;
        if(this.style == null){
            this.style = MyProgressBar.STYLE_BLUE;
        }
    }
}
