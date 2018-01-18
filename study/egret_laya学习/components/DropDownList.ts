/**
 * Created by zhongguo168a on 2016/3/22.
 *
 * 下拉列表
 */
class DropDownList extends eui.Component {

    public title:ShadowButton;
    public listArea:eui.Group;
    public scroller:MyScroller;
    public arrow:eui.Group;
    public titleArrow:eui.Image;
    public list:eui.List;
    public submit:MyButton;

    /**
     * 0-自动， 1下，-1上
     */
    public direction:number = 0;
    public _itemRenderSkinName:string = "resource/skins/component_skins/DropDownItemRenderSkin.exml";

    constructor() {
        super();

        // this.list = new eui.List();
        
    }

    public set itemRenderSkinName(value:string) {
        if(this._itemRenderSkinName == value){
            return;
        }
        this._itemRenderSkinName = value;
        if(this.list != null){
            this.list.itemRendererSkinName = value;
        }
    }

    public get itemRenderSkinName():string {
        return this._itemRenderSkinName
    }


    $onRemoveFromStage():void {
        super.$onRemoveFromStage();

        if(LayerManager.UI_Tips.contains(this.listArea)){
            LayerManager.UI_Tips.removeChild(this.listArea);
        }

        App.StageUtils.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    $onAddToStage(stage:egret.Stage, nestLevel:number):void {
        super.$onAddToStage(stage, nestLevel);

    }

    private onTouchEnd(event:egret.TouchEvent){
        var lp = this.title.globalToLocal(event.stageX, event.stageY);
        var br = this.title.getBounds();
        if (br.containsPoint(lp) == false) {
            lp = this.listArea.globalToLocal(event.stageX, event.stageY);
            br = this.listArea.getBounds();
            if (br.containsPoint(lp) == false) {
                this.listArea.visible = false;
            }
        }
    }

    public _hideSelected:boolean = false;

    //下拉列表中，是否隐藏选中的项
    public get hideSelected():boolean{
        return this._hideSelected;
    }

    public set hideSelected(value:boolean){
        if(this._hideSelected == value){
            return;
        }

        this._hideSelected = value;
        this.update();
    }

    private _allowMultipleSelection:boolean;
    public set allowMultipleSelection(value:boolean){
        this._allowMultipleSelection = value;
    }
    public get allowMultipleSelection():boolean{
        return this._allowMultipleSelection;
    }




    protected measure():void {
        super.measure();

        this.updateListArea();
    }

    protected updateListArea(){
        if (this.listArea && this.list && this.dataProvider) {
            var per = this.list.getVirtualElementAt(0).height;
            if(this._hideSelected == true){
                this.scroller.height = per * Math.min(5, this.dataProvider.length - 1);
            }else{
                this.scroller.height = per * Math.min(5, this.dataProvider.length);
            }

            this.listArea.height = this.scroller.height + Number(this.scroller.top) * 2;
            //
            if(this.submit && this.submit.visible == true){
                this.listArea.height += this.submit.height;
            }

            if(this.scroller.height >= this.list.contentHeight){
                this.scroller.disableArrow();
            }else{
                this.scroller.enableArrow();
            }
        }
    }


    public updateMulti(){
        if (this.title == null) {
            return;
        }

        if (this._dataProvider == null) {
            return;
        }

        var text = "";
        if(this.list.selectedIndices.indexOf(0) != -1){
            text = this.list.dataProvider.getItemAt(0).label;
        }else{
            for(var i = 0; i < this.list.dataProvider.length;i++){
                if(this.list.selectedIndices.indexOf(i) == -1){
                    continue;
                }
                text += this.list.dataProvider.getItemAt(i).label + ",";
            }
            text = text.substring(0, text.length - 1);
        }

        var tf = new TextField();
        var index = 1;
        var width = this.width - this.titleArrow.width;
        while(tf.textWidth < width && index <= text.length){
            tf.text = text.substring(0, index);
            index++;
        }
        this.title.label = tf.text ;
    }

    public update() {
        if (this.title == null) {
            return;
        }

        if (this._dataProvider == null) {
            return;
        }

        var listData = [];
        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = {label: this._dataProvider.getItemAt(i).label, index: i, last:false, selected:true};
            if(i == this._dataProvider.length - 1){
                item.last = true;
            }

            if (i == this._selectedIndex) {
                this.title.label = this._dataProvider.getItemAt(i).label;
                if (this.hideSelected == false) {
                    listData.push(item);
                }
            } else {
                listData.push(item);
            }

        }

        if (this.hideSelected == true) {
            this.list.selectedIndex = -1;
        }

        var dp = new eui.ArrayCollection(listData);
        this.list.dataProvider = dp;

        if(this.allowMultipleSelection){
            var arr = [];
            for(var i = 0; i < dp.length; i++){
                arr.push(i);
            }
            this.list.selectedIndices = arr;
        }
    }


    private _dataProvider:eui.ArrayCollection;
    public set dataProvider(value:eui.ArrayCollection) {

        this._dataProvider = value;

        this.update();
        this.updateListArea();

    }

    public get dataProvider():eui.ArrayCollection {
        return this._dataProvider;
    }


    protected _selectedIndex:number = 0;
    public get selectedIndex():number {
        return this._selectedIndex;
    }

    /**
     * 设置当前选项
     * @param val
     */
    public set selectedIndex(val:number) {
        if(this._selectedIndex == val){
            return
        }

        this._selectedIndex = val;
        this.update();

    }


    protected openListArea(){
        this.listArea.width = this.width;
        LayerManager.UI_Tips.addChild(this.listArea);
        var gp = this.title.localToGlobal(0, 0);
        this.listArea.x = gp.x;
        this.listArea.y = gp.y;


        if(this.direction == 0){
            if (gp.y + this.title.height + this.listArea.height > App.StageUtils.getHeight()) {
                this._dir = -1;
            } else {
                this._dir = 1;
            }
        }else{
            this._dir = this.direction;
        }

        if(this._dir == 1){
            egret.Tween.get(this.listArea).to({y: gp.y + this.title.height - 2}, 0);

            this.arrow.y = -1;
            this.arrow.rotation = 180;
        }else{

            this.arrow.rotation = 0;
            this.arrow.y = this.listArea.height + 1;

            egret.Tween.get(this.listArea).to({y: gp.y + this.title.y - this.listArea.height + 2}, 0);
        }

        this.listArea.visible = true;
        this.listArea.touchEnabled = true;
        this.listArea.touchChildren = true;

        App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

    }

    protected closeListArea(){
        var gp = this.title.localToGlobal(0, 0);

        if (this._dir == 1) {
            egret.Tween.get(this.listArea).to({y: gp.y}, 0).call(function () {
                this.listArea.visible = false;
                if(LayerManager.UI_Tips.contains(this.listArea)){
                    LayerManager.UI_Tips.removeChild(this.listArea);
                }
            }, this);
        } else {
            egret.Tween.get(this.listArea).to({y: gp.y}, 0).call(function () {
                this.listArea.visible = false;
                if(LayerManager.UI_Tips.contains(this.listArea)){
                    LayerManager.UI_Tips.removeChild(this.listArea);
                }
            }, this);
        }


        App.StageUtils.getStage().removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
    }

    private _dir:number = 1;//1下  -1上
    protected childrenCreated():void {
        super.childrenCreated();

        if (this.title != null) {
            this.title.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (this.listArea.visible == false) {
                    this.openListArea();
                } else {
                    this.closeListArea();
                }
            }, this);
        }

        this.list.allowMultipleSelection = this._allowMultipleSelection;

        this.list.itemRenderer = DropDownItemRender;
        this.list.itemRendererSkinName = this._itemRenderSkinName;
        this.list.left = 5;
        this.list.right = 5;
        this.list.top = 3;

        
        if(this.list.allowMultipleSelection){
            this.submit.visible = true;
            this.submit.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
                egret.Tween.get(this.list).to({y: 0}, this.title.height).call(function () {
                    this.listArea.visible = false;
                    this.listArea.touchEnabled = false;
                    this.listArea.touchChildren = false;
                }, this);

                this.updateMulti();
            }, this);

            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (event:eui.ItemTapEvent) {
                var dp = this.list.dataProvider as ArrayCollection;
                if(event.item.index == 0){
                    var arr = [];
                    if(this.list.selectedIndices.indexOf(event.item.index) != -1){
                        for(var i = 0; i < dp.length; i++){
                            arr.push(i);
                            var item = dp.getItemAt(i);
                            item["selected"] = true;
                        }
                    }else{
                        for(var i = 0; i < dp.length; i++){
                            var item = dp.getItemAt(i);
                            item["selected"] = false;
                        }
                    }
                    this.list.selectedIndices = arr;
                    dp.refresh();
                }else{
                    var index0 = this.list.selectedIndices.indexOf(0);
                    if(index0 != -1){
                        if(this.list.selectedIndices.length != this.dataProvider.length){
                            this.list.selectedIndices.splice(index0, 1);
                            var item0 = dp.getItemAt(0);
                            item0["selected"] = false;
                            dp.replaceItemAt(item0, 0);
                        }
                    }else{
                        if(this.list.selectedIndices.length == this.dataProvider.length - 1){
                            this.list.selectedIndices.push(0);
                            var item0 = dp.getItemAt(0);
                            item0["selected"] = true;
                            dp.replaceItemAt(item0, 0);
                        }
                    }

                    if(event.itemIndex != 0){
                        var item = event.item;
                        item["selected"] = this.list.selectedIndices.indexOf(event.itemIndex) != -1;
                        dp.replaceItemAt(item, event.itemIndex);
                    }
                }
            }, this);

            this.list.itemRendererSkinName = "DropDownCellMultiSkin";
        }else{
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (event:eui.ItemTapEvent) {
                this._selectedIndex = event.item.index;
                egret.Tween.get(this.list).to({y: 0}, this.title.height).call(function () {
                    this.listArea.visible = false;
                    this.listArea.touchEnabled = false;
                    this.listArea.touchChildren = false;
                }, this);

                this.update();

                event.itemIndex = this._selectedIndex;
                event.item = this._dataProvider.getItemAt(this._selectedIndex);
                this.dispatchEvent(event);
            }, this);
        }

        if (this.listArea != null) {
            this.listArea.visible = false;
            this.listArea.touchEnabled = false;
            this.listArea.touchChildren = false;
        }
        
        //
        this.update();
    }
}