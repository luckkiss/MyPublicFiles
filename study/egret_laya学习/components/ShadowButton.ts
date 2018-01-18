import Label = eui.Label;
/**
 * Created by zhongguo168a on 2016/5/9.
 */


class ShadowButton extends eui.Button{

    private _shadow:egret.TextField;
    private _shadowColor:number;

    private _text:string;

    get shadowColor():number {
        return this._shadowColor;
    }

    set shadowColor(value:number) {
        if(this._shadowColor == value){
            return;
        }
        this._shadowColor = value;
        this._shadow.textColor = value;
    }


    constructor() {
        super();

        this._shadow = new eui.Label();
    }


    protected measure():void {
        super.measure();
    }


    public set label(value:string){
        this._text = value;
        if(this.labelDisplay){
            var l = this.labelDisplay as Label;
            this.labelDisplay.text = this._text;
            FilterUtils.updateShadowLabel(l, this._shadow, this._shadowColor, 1.5, 1.3);
        }
    }




    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);

        if(this.labelDisplay){
            var l = this.labelDisplay as Label;

            this.addChild(this._shadow);
            this.addChild(l);
            FilterUtils.updateShadowLabel(l, this._shadow, this._shadowColor, 1.5, 1.3);
        }
    }

    protected childrenCreated():void {
        super.childrenCreated();

        if(this.labelDisplay){
            this.labelDisplay.text = this._text;
        }
    }
}