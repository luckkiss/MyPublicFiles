/**
 * Created by zhongguo168a on 2016/3/29.
 */


class UnderlineLabel extends eui.Label {

    private _href:string = "";
    public set href(value:string) {
        this._href = value;
    }

    public get href():string {
        return this._href;
    }

    constructor() {
        super();

        this.touchEnabled = false;
    }


    protected childrenCreated():void {
        super.childrenCreated();

        this.textFlow = new Array<egret.ITextElement>(
            {text: this.text, style: {"href": this.href, "underline": true, "bold": false}});
    }


    public setLabel(value:string) {
        this.text = value;
        this.textFlow = new Array<egret.ITextElement>(
            {text: this.text, style: {"href": this.href, "underline": true, "bold": false}});
    }
    
    public set label(text: string) {
        this.setLabel(text);
    }
}