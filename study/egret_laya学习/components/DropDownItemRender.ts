/**
 * Created by zhongguo168a on 2016/3/22.
 */


class DropDownItemRender extends eui.ItemRenderer {

    private shadowLabel:egret.TextField;//阴影

    public labelDisplay:eui.Label;
    public line:eui.Image;

    public selectObj:eui.ToggleButton;

    constructor() {
        super();

        this.percentWidth = 100;
    }


    protected childrenCreated(): void {
        super.childrenCreated();
    }

    protected dataChanged():void {
        this.line.visible = true;
        if(this.data.last){
            this.line.visible = false;
        }

        if(this.selectObj != null){
            this.selectObj.selected = this.data.selected;
            console.log("dropdown ", this.data.selected, this.selectObj.selected)
        }
    }

    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);
        this.line.width = this.width;
        this.line.y = this.height;
        FilterUtils.updateShadowLabel(this.labelDisplay, this.shadowLabel, 0x003252, 1.5, 1.3);
    }

}