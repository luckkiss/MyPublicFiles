/**
 * Created by zhongguo168a on 2016/3/24.
 */


class MyImage extends eui.Component{

    public bg:eui.Image;
    public body:eui.Image;



    private _source:string | egret.Texture;
    public get source():string | egret.Texture{
        return this._source;
    }
    public set source(value:string | egret.Texture){
        if(this._source == value){
            return;
        }
        this._source = value;

        if(this.body != null){
            this.body.source = this._source;
        }

        this.invalidateProperties();
    }

    private _bgsource:string | egret.Texture;
    public get bgsource():string | egret.Texture{
        return this._bgsource;
    }
    public set bgsource(value:string | egret.Texture){
        if(this._bgsource == value){
            return;
        }

        this._bgsource = value;
        if(this.bg != null){
            this.bg.source = this._bgsource;
        }

        this.invalidateProperties();
    }

    //边距
    private _padding:number = 6;
    get padding():number {
        return this._padding;
    }

    set padding(value:number) {
        if(this._padding == value){
            return;
        }

        this._padding = value;
        this.invalidateProperties();
    }


    constructor() {
        super();
    }


    protected childrenCreated():void {
        super.childrenCreated();

        if(this.body == null && this._source != null){
            this.body.source = this._source;
        }

        if(this.bg != null && this._bgsource){
            this.bg.source = this._bgsource;
        }
    }


    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);

        this.bg.width = this.width;
        this.bg.height = this.height;

        this.body.width = this.width - this._padding * 2;
        this.body.height = this.height - this._padding * 2;
        this.body.x = this._padding;
        this.body.y = this._padding;

    }
}