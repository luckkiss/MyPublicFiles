/**
 * Created by zhongguo168a on 2016/5/18.
 */



class MyItemRenderer extends eui.ItemRenderer{

    constructor() {
        super();
    }

    public dispatchItemRenderEvent(type:string){
        var event:ItemRenderEvent = new ItemRenderEvent(type);
        event.data = this.data;
        event.index = this.itemIndex;

        this.parent.dispatchEvent(event);
    }
}