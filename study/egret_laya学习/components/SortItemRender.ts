/**
 * Created by zhongguo168a on 2016/3/21.
 */
class SortItemRender extends MyItemRenderer {
    public selectObj:eui.ToggleButton;
    public container:eui.Group;
    public selectArea:SortSelectRect;
    protected isCreated:boolean = false;
    protected isSized:boolean = false;

    constructor() {
        super();

        this.addEventListener(eui.UIEvent.COMPLETE, function () {
            if (this.selectObj != null) {
                if (this.selectObj.hasEventListener(egret.TouchEvent.TOUCH_TAP) == true) {
                    return;
                }

                this.selectObj.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt:egret.TouchEvent) {
                    evt.stopImmediatePropagation();

                    this.data.selected = !this.data.selected;
                    this.selectObj.selected = this.data.selected;
                    this.dispatchItemRenderEvent(ItemRenderEvent.SORTLIST_SELECT_BTN_CHANGED);
                }, this);

                if (this.selectArea) {
                    this.selectArea.percentHeight = 100;
                    this.selectArea.right = 0;
                    this.selectArea.fillColor = 0;
                    this.selectArea.fillAlpha = 0;
                    this.selectArea.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt: egret.TouchEvent) {
                        if(this.data.enabled == false){
                            return;
                        }
                        evt.stopImmediatePropagation();
                        this.data.selected = !this.data.selected;
                        this.selectObj.selected = this.data.selected;
                        this.dispatchItemRenderEvent(ItemRenderEvent.SORTLIST_SELECT_BTN_CHANGED);
                    }, this);
                }

                this.isCreated = true;
            }
        }, this);

    }


    protected childrenCreated():void {
        super.childrenCreated();

        this.isCreated = true;
    }


    protected commitProperties():void {
        super.commitProperties();

        this.updateSize();
    }

    protected dataChanged():void {
        //
        if (this.selectObj != null) {
            if (this.data.enabled == false) {
                this.selectObj.enabled = false;
            } else {
                this.selectObj.enabled = true;
                this.selectObj.selected = this.data.selected;
            }
        }

        this.updateSize();
    }


    protected updateSize() {
        if (this.isCreated && this.isSized == false && this.parent) {
            var widthArr:Array<eui.Group> = (this.parent as List).data;
            if (widthArr != null) {
                var swid = 0;
                for (var i = 0; i < widthArr.length; i++) {
                    var g = this.container.getChildAt(i) as eui.Group;
                    var tg = widthArr[i];
                    g.width = tg.width;
                    g.percentHeight = 100;
                    g.x = tg.x;
                    g.y = 0;

                    if(this.selectArea){
                        if(i >= this.selectArea.titleIndex ){
                            swid += tg.width;
                        }
                    }

                }

                if(this.selectArea){
                    this.selectArea.width = swid;
                }
                this.isSized = true;
            } else {
                console.error("widthArr is null!")
            }
        }
    }
}