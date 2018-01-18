/**
 * Created by zhongguo168a on 2016/3/24.
 */


class CoinImage extends eui.Component{

    public icon_img:eui.Image;
    public text_lab:eui.Label;
    
    private ImageList:Object = {
        1: "common_money_g_small_icon_png",
        2: "common_money_silver_small_icon_png",
        3: "common_money_c_small_icon_png",
    };

    private _source: string;
    public _label: string;
    
    public get source():string{
        return this._source;
    }
    public set source(value:string){
        this._source = value;

        if(this.icon_img != null){
            this.icon_img.source = this._source;
        }
    }
    


    public get label(): string {
        return this._label;
    }

    public set label(v: string) {
        this._label = v;

        if(this.text_lab != null) {
            this.text_lab.text = v;
        }
    }
    
    public setInfo(type:number, num:number, coinType:number = 1){
        var img = this.ImageList[type];
        this.source = img;
        this.label = "" + TextFormatChanger.simplifyNumber(num,0);
    }

    constructor() {
        super();
    }


    protected childrenCreated():void {
        super.childrenCreated();
        this.skinName = GlobalConst.modelSkinPath + "component_skins/CoinImageSkin.exml";
        if(this.icon_img != null){
            this.icon_img.source = this._source;
        }
        if(this.text_lab != null){
            this.text_lab.text = this._label;
        }
    }
}