/**
 *
 * @alpen 带指向对象位置的提示框
 * 箭头可以在面部的上下左右位置
 * 默认箭头是在一边的中间，默认分为3部分
 * 如果面板超出了父板相应方向，则进行相应的处理
 * 位置根据要定位的对象来定
 *
 * 注意：关闭面板一定要在宿主面板执行
 *       $onRemoveFromStage(): void {
 *         if(this.followTipPanel) this.followTipPanel.destory();
 *       }
 *       public leave() {
        if(this.followTipPanel) this.followTipPanel.destory();
         this.followTipPanel=null;
    }
 */
class FollowTipPanel extends eui.Component {
    private arrow_space:number = 4;//箭头和面板之间的间距
    public static ARROW_LEFT:number = 0;
    public static ARROW_RIGHT:number = 1;
    public static ARROW_TOP:number = 2;
    public static ARROW_BUTTOM:number = 3;
    private topmargin:number = 10;//内容与底板的边距，同时也作为跟屏幕的边距
    private leftmargin:number = 10;
    private rightmargin:number = 10;
    private buttommargin:number = 10;

    private content:eui.Group;
    private arrow_img:eui.Image;
    private bg_img:eui.Image;
    private locobj:egret.DisplayObject;
    private childobj:egret.DisplayObject;
    private addObj:egret.DisplayObject;

    public constructor() {
        super();

        this.bg_img = new eui.Image;
        this.bg_img.source = RES.getRes("common_dropdown_bg_png");
        this.bg_img.scale9Grid = new egret.Rectangle(12, 12, 76, 76);
        //  this.bg_img.percentWidth=100;
        //  this.bg_img.percentHeight=100;
        this.addChild(this.bg_img);
        this.arrow_img = new eui.Image();
        this.arrow_img.source = RES.getRes("common_dropdown_arrow_png");
        this.addChild(this.arrow_img);
        // this.skinName = GlobalConst.modelSkinPath + "component_skins/FollowtipPanelSkin.exml";

    }

    protected childrenCreated():void {
        super.childrenCreated();
    }



    public isOpened():boolean{
        return LayerManager.UI_Tips.contains(this);
    }


    public hide() {
        if (LayerManager.UI_Tips.contains(this)) {
            LayerManager.UI_Tips.removeChild(this);
        }

        var stage = App.StageUtils.getUIStage();
        stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ClickFun, this);
        stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.MoveFun, this);
    }

    public show(){
        LayerManager.UI_Tips.addChild(this);
        var stage = App.StageUtils.getUIStage();
        if (stage.hasEventListener(egret.TouchEvent.TOUCH_TAP) == false) {
            stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ClickFun, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.MoveFun, this);
        }
    }


    public setContentAt(point:egret.Point, childObj:egret.DisplayObject) {
        this.arrow_img.rotation = 90;
        this.arrow_img.x = point.x + 10 + this.arrow_img.height;
        this.arrow_img.y = point.y + this.arrow_img.width / 2;
        this.bg_img.x = this.arrow_img.x - this.arrow_space;
        this.bg_img.y = this.arrow_img.y + this.arrow_img.width / 2 - this.bg_img.height / 2;
        //判断上下是否出边界
        if (this.bg_img.y <= 0) this.bg_img.y = this.topmargin;
        if (this.bg_img.y + this.bg_img.height + this.buttommargin >= App.StageUtils.getHeight()) {
            this.bg_img.y = App.StageUtils.getHeight() - this.bg_img.height - this.buttommargin;
        }

        childObj.x = this.bg_img.x + this.leftmargin;
        childObj.y = this.bg_img.y + this.topmargin;
        //
        this.show();
    }

    public setContent(locobj:egret.DisplayObject, childObj:egret.DisplayObject, direction:number = FollowTipPanel.ARROW_LEFT, addObj:egret.DisplayObject = null):void {
        this.show();
        //
        this.locobj = locobj;
        this.addObj = addObj;
        if (this.childobj == null) {
            this.childobj = childObj;
            this.addChild(childObj);

        } else if (this.childobj != childObj) {
            this.removeChild(this.childobj);
            this.childobj = null;
            this.childobj = childObj;
            this.addChild(childObj);
        }

        if (this.childobj) {
            this.bg_img.width = childObj.width + this.leftmargin + this.rightmargin;
            this.bg_img.height = childObj.height + this.topmargin + this.buttommargin;
        }

        var globalPonit:egret.Point = locobj.parent.localToGlobal(locobj.x, locobj.y);
        //  childObj.x=this.leftmargin;
        //  childObj.y=this.topmargin;

        //定位：
        //注意，图片旋转后，他们的宽和高还是以前低
        switch (direction) {
            case FollowTipPanel.ARROW_LEFT://箭头出现在对象的左边
                this.arrow_img.rotation = 270;
                // console.log("width:"+this.arrow_img.width+":::height:::"+this.arrow_img.height);
                this.arrow_img.x = globalPonit.x - this.arrow_img.height;
                this.arrow_img.y = globalPonit.y + locobj.height / 2 + this.arrow_img.width / 2;
                this.bg_img.x = this.arrow_img.x - this.bg_img.width + this.arrow_space;
                this.bg_img.y = this.arrow_img.y - this.bg_img.height / 2 - this.arrow_img.width / 2;
                //判断上下是否出边界
                if (this.bg_img.y <= 0) this.bg_img.y = this.topmargin;
                if (this.bg_img.y + this.bg_img.height + this.buttommargin >= App.StageUtils.getHeight()) {
                    this.bg_img.y = App.StageUtils.getHeight() - this.bg_img.height - this.buttommargin;
                }
                break;
            case FollowTipPanel.ARROW_RIGHT://箭头出现在对象的右边
                this.arrow_img.rotation = 90;
                this.arrow_img.x = globalPonit.x + locobj.width + this.arrow_img.height;
                this.arrow_img.y = globalPonit.y + locobj.height / 2 - this.arrow_img.width / 2;
                this.bg_img.x = this.arrow_img.x - this.arrow_space;
                this.bg_img.y = this.arrow_img.y + this.arrow_img.width / 2 - this.bg_img.height / 2;
                //判断上下是否出边界
                if (this.bg_img.y <= 0) this.bg_img.y = this.topmargin;
                if (this.bg_img.y + this.bg_img.height + this.buttommargin >= App.StageUtils.getHeight()) {
                    this.bg_img.y = App.StageUtils.getHeight() - this.bg_img.height - this.buttommargin;
                }
                break;
            case FollowTipPanel.ARROW_TOP://箭头出现在对象的上边
                //this.arrow_img.rotation = 270;
                // console.log("width:"+this.arrow_img.width+":::height:::"+this.arrow_img.height);
                this.arrow_img.x = globalPonit.x + (locobj.width - this.arrow_img.width) * .5;
                this.arrow_img.y = globalPonit.y - this.arrow_img.height;
                this.bg_img.x = this.arrow_img.x - (this.bg_img.width - this.arrow_img.width) * .5;
                this.bg_img.y = this.arrow_img.y - this.bg_img.height + this.arrow_space;
                //判断是否出了边界,只用判断X
                if (this.bg_img.x <= 0) this.bg_img.x = this.leftmargin;

                if (this.bg_img.x + this.bg_img.width + this.rightmargin >= App.StageUtils.getWidth()) {
                    this.bg_img.x = App.StageUtils.getWidth() - this.bg_img.width - this.rightmargin;
                }

                break;
            case FollowTipPanel.ARROW_BUTTOM://箭头出现在对象的下边
                this.arrow_img.rotation = 180;
                // console.log("width:"+this.arrow_img.width+":::height:::"+this.arrow_img.height);
                this.arrow_img.x = globalPonit.x + (locobj.width + this.arrow_img.width) * .5;
                this.arrow_img.y = globalPonit.y + locobj.height + this.arrow_img.height;
                this.bg_img.x = this.arrow_img.x - (this.bg_img.width + this.arrow_img.width) * .5;
                this.bg_img.y = this.arrow_img.y - this.arrow_space;
                //判断是否出了边界,只用判断X
                if (this.bg_img.x <= 0) this.bg_img.x = this.leftmargin;

                if (this.bg_img.x + this.bg_img.width + this.rightmargin >= App.StageUtils.getWidth()) {
                    this.bg_img.x = App.StageUtils.getWidth() - this.bg_img.width - this.rightmargin;
                }

                break;
        }

        childObj.x = this.bg_img.x + this.leftmargin;
        childObj.y = this.bg_img.y + this.topmargin;
    }

    private ClickFun(evt:egret.TouchEvent):void {
        if (this.hitTestPoint(evt.stageX, evt.stageY)) return;
        if (this.locobj && this.locobj.hitTestPoint(evt.stageX, evt.stageY)) return;
        if (this.addObj && this.addObj.hitTestPoint(evt.stageX, evt.stageY)) return;
        this.hide();
        evt.stopPropagation();
    }

    private MoveFun():void {
        this.hide();
    }


    public destory():void {
        if(LayerManager.UI_Tips.contains(this)){
            LayerManager.UI_Tips.removeChild(this);
        }

        App.StageUtils.getUIStage().removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.MoveFun, this);
        App.StageUtils.getUIStage().removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ClickFun, this);
    }
}
