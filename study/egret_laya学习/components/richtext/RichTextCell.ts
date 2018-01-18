/**
 * Created by zhongguo168a on 2016/7/2.
 */


class RichTextCell extends eui.ItemRenderer{

    public label:eui.Label;
    public icons:Array<eui.Image> = [];

    constructor() {
        super();
    }

    protected childrenCreated():void {
        super.childrenCreated();

        this.label.fontFamily = "微软雅黑";
        this.label.size = 20;
        this.label.addEventListener( egret.TextEvent.LINK, function( evt:egret.TextEvent ){
            var event = new RichTextCellEvent(RichTextCellEvent.HREF_CLICKED);
            event.href = evt.text;
            this.parent.dispatchEvent(event);
        }, this );
    }

    protected dataChanged():void {
        super.dataChanged();
        
        for(var i = 0; i < this.icons.length; i++){
            var iconInst = this.icons[i];
            if(this.contains(iconInst)){
                this.removeChild(iconInst);
            }
            iconInst.source = null;
        }

        this.label.textFlow = this.data.flow;
        var max = this.label.height;
        for(var i = 0; i < this.data.icons.length; i++){
            var icon = this.data.icons[i];
            var image = new eui.Image();
            var res:egret.Texture = RES.getRes(icon.icon);
            image.source = res;
            image.x = icon.x;

            max = Math.max(max, res.bitmapData.height);

            this.addChild(image);
            this.icons.push(image);
        }

        this.height = max;
        this.label.y = (max - this.label.height) * 0.5;
    }


    $onRemoveFromStage():void {
        super.$onRemoveFromStage();

        for(var i = 0; i < this.icons.length; i++){
            var icon = this.icons[i];
            if(this.contains(icon)){
                this.removeChild(icon);
            }
            icon.source = null;
        }
    }
}