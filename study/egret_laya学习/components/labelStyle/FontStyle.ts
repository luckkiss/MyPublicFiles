import TextField = egret.TextField;
/**
 *
 * @alpen  字体样式设置
 *
 */
class FontStyle extends eui.Label {
    private _style:Object;
    private _label:string = "";
    protected _lanId;
    private shadowlabel:egret.TextField;//投影文字
    private shadowColor:number;
    private shadowPx:number;//投影大小
    private isInit: boolean;//已经设置了样式
    public valueNum: number;//对应的数字值
    public _visible:boolean;
    public constructor() {
        super();
        this._visible=true;
        this.fontFamily = FontColorStyleConst.defaultFont;
        this.touchEnabled = false;
    }

    public set label(text:string) {
        this._label = text;
        this.text = text;
        if(this.shadowlabel){
            this.shadowlabel.text=this.text;
        }
        this.invalidateProperties();
    }

    public set RichLabel(text:string){
       // this._label = text;
        var styleParser = new egret.HtmlTextParser();
        this.textFlow = styleParser.parser(text);
        
    }
    public get label():string{
        return this._label;
    }

    public set lanId(v:string) {
        this._lanId = v;
        this.invalidateProperties();
    }

    public set fontStyle(v:string) {
        v = "FontColorStyleConst." + v;
        var style = egret.getDefinitionByName(v);
        this.setFontStyle(style)
    }

    public setFontStyle(v:Object) {
        this._style = v;
        this.invalidateProperties();
    }

    protected childrenCreated():void {
        super.childrenCreated();

        this.updateText();
    }


    protected commitProperties():void {
        super.commitProperties();
        this.updateText();
        this.updateFontStyleCommit();
    }


    protected measure():void {
        super.measure();
    }

    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);

        this.updateFontStyleDisplay();
    }

    protected updateText() {
        if (this._lanId != "" && this._lanId != null) {
            this.text = App.Language.getLanText(this._lanId);
        } else if (this._label != null) {
            this.text = this._label;
        }
    }

    protected updateFontStyleDisplay() {
        if (!this.shadowlabel) {
            return;
        }

        console.log(this.label + ":" + this.x);
    

        this.shadowlabel.width = this.width;
        this.shadowlabel.height = this.height;

        this.shadowPx = this._style["shadow"];
        this.shadowlabel.x = this.x + this.shadowPx * 0.87;
        this.shadowlabel.y = this.y + this.shadowPx * 0.5;
        this.shadowlabel.text=this.text;
        // if (this._style.hasOwnProperty("stroke") && this._style["stroke"] !== "") {
        //     this.stroke = this._style["stroke"];
        //     this.shadowlabel.x += this.stroke;
        //     this.shadowlabel.y += this.stroke;
        // }
    }

    protected updateFontStyleCommit() {
        var style = this._style;
        if (!style) {
            return;
        }

        if (style.hasOwnProperty("color") && style["color"] !== "") {
            this.textColor = style["color"];
        }

        if (style.hasOwnProperty("size") && style["size"] !== "") {
            this.size = style["size"];
        }

        if (style.hasOwnProperty("stroke") && style["stroke"] !== "" && style.hasOwnProperty("strokeColor") && style["strokeColor"] !== "") {
            this.stroke = style["stroke"];
            this.strokeColor = style["strokeColor"];
        } else {
            this.stroke = 0;
        }

        if (this.parent && this.parent.contains(this.shadowlabel)) {
            this.parent.removeChild(this.shadowlabel);
        }

        if (style.hasOwnProperty("shadow") && style["shadow"] !== "" && style.hasOwnProperty("shodowColor") && style["shodowColor"] !== "") {
            this.shadowColor = style["shodowColor"];

            if (!this.shadowlabel) {
                this.shadowlabel = new TextField();
                this.shadowlabel.visible=this._visible;
                this.shadowlabel.touchEnabled = false;
            }
            if (this.parent) {
                this.parent.addChildAt(this.shadowlabel, this.parent.getChildIndex(this));
            }

            this.shadowlabel.fontFamily = this.fontFamily;
            this.shadowlabel.size = this.size;
            this.shadowlabel.text = this.text;
            this.shadowlabel.textColor = this.shadowColor;
            this.shadowlabel.textAlign = this.textAlign;
            this.shadowlabel.verticalAlign = this.verticalAlign;
            this.shadowlabel.lineSpacing = this.lineSpacing;
            this.shadowlabel.anchorOffsetX = this.anchorOffsetX;
            this.shadowlabel.anchorOffsetY = this.anchorOffsetY;
        }


    }


    //控制显示隐藏
    public setVisible(b:boolean):void {
        this._visible = b;
        this.visible = b;
        if (this.shadowlabel) this.shadowlabel.visible = b;
    }
}
