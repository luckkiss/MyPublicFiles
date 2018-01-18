/**
 * Created by zhongguo168a on 2016/3/19.
 *
 * 添加了排序功能的数据容器
 *
 * 传入的数据要求，需要添加一下属性
 * selected：item是否选中
 * enable：item是否允许点击（是否变灰）
 * ignore：item时候被忽视（全选判断的时候被忽略）
 *
 */
class SortList extends eui.Component {


    /**
     * 点击标题按钮，进行排序的时候触发。
     * 如果设置了onSort属性，组件跳过默认排序。
     *
     * onSort = function(sortProp:string):void;
     *
     * sortProp = SortListLabel.sortProp
     */
    public onSort:Function;
    /**
     * 标题-文字-皮肤
     */
    public titleGroup:eui.Group;
    public contentGroup:eui.Group;
    public dataGroup:List;
    public scrollBar:MyScroller;
    public arrowIcon:eui.Image;
    public selectAllButton:eui.ToggleButton = null;

    private failGroup:eui.Group;
    private failImage:eui.Image;
    private failLabel:FontStyle;

    public failStyle:number = 0;
    public failText:string;

    private _selectMax:number = 0;

    /// 点击的标签-上一个
    private prevSelected:number = -1;

    private _sortSelected:number = -1;

    get sortSelected():number {
        return this._sortSelected;
    }

    /// 被选中的标签
    set sortSelected(value:number) {
        this._sortSelected = value;
        this.invalidateProperties();
    }


    private _sortProp:string;

    /**
     * 被选中的排序属性
     */
    get sortProp():string {
        return this._sortProp;
    }

    private _sortDirection:number = 1;

    get sortDirection():number {
        return this._sortDirection;
    }

    /**
     * 被选中的排序属性的方向
     * 1升序 -1降序
     */
    set sortDirection(value:number) {
        this._sortDirection = value;

        this.invalidateProperties();
    }


    ///
    private _dataProvider:eui.ArrayCollection;

    /**
     * 是否允许选择
     */
    private _selectionEnabled:boolean;


    private _selectionMulti:boolean = true;
    get selectionMulti():boolean {
        return this._selectionMulti;
    }

    /**
     * 是否允许多选，默认为true
     */
    set selectionMulti(value:boolean) {
        this._selectionMulti = value;
    }

    private _selectionIndex:number = -1;


    /**
     * 当前选择，用于单选, -1表示没有选择
     */
    get selectionIndex():number {
        return this._selectionIndex;
    }

    //已经选择的数量
    protected _numSelected:number = 0;

    get numSelected() {
        return this._numSelected;
    }    

    /**
     * 可选择的最大数量
     * @returns {number}
     */
    public get selectMax():number {
        return this._selectMax;
    }

    /**
     * 可以选择的最大数量，超过以后变灰。
     *
     * 需要在dataProvider的对象中设置enabled属性，才能开启功能
     */
    public set selectMax(value:number) {
        if (this._selectMax == value) {
            return;
        }

        this._selectMax = value;


    }


    /**
     * 如果设置为true，则需要在dataprovider中设置selected属性。
     * @param value
     */
    public set selectionEnabled(value:boolean) {
        this._selectionEnabled = value;
    }

    public set dataProvider(value:eui.ArrayCollection) {
        this._dataProvider = value;
        this.updateDataProvider();
        if (this.dataGroup != null) {
            this.dataGroup.dataProvider = value;

        }

        if (this.selectAllButton != null && this.selectAllButton.selected == true) {
            var numSelected = 0;
            for (var i = 0; i < this._dataProvider.length; i++) {
                if (this._selectMax != 0 && numSelected >= this._selectMax) {
                    break;
                }

                var item = this._dataProvider.getItemAt(i);
                if (item.selected == false) {
                    item.selected = true;
                    item.enabled = true;
                    this._dataProvider.replaceItemAt(item, i);
                }

                numSelected++;
            }
        }
    }

    public get dataProvider():eui.ArrayCollection {
        return this._dataProvider;
    }


    /**
     * 添加
     * @param value
     */
    public addDataProvider(value:eui.ArrayCollection):void {
        if (value.length == 0) {
            return;
        }

        for (var i = 0; i < value.length; i++) {
            var data = value.getItemAt(i);
            if (data.hasOwnProperty("enabled") && this.selectAllButton != null) {
                if (this._selectMax == 0 || this._numSelected < this._selectMax) {
                    if (this.selectAllButton.selected == true) {
                        this._numSelected++;
                        data.enabled = true;
                        data.selected = true;
                    }
                } else {
                    data.enabled = false;
                    data.selected = false;
                }
            }

            this._dataProvider.addItem(data);
        }

        this.updateDataProvider();
    }

    private _updateTimer:number = 0;

    private updateDataProvider() {
        if (this._dataProvider.length > 0) {
            this.contentGroup.addChild(this.scrollBar);
            if (this.contentGroup.contains(this.failGroup)) {
                this.contentGroup.removeChild(this.failGroup);
            }
            if (this._updateTimer != 0) {
                App.TimerManager.remove(this._updateTimer);
            }
            this._updateTimer = App.TimerManager.doTimer(100, 1, function () {
                this.scrollBar.updateBtn();
            }, this);
        } else {
            if (this.contentGroup.contains(this.scrollBar)) {
                this.contentGroup.removeChild(this.scrollBar);
            }
            this.contentGroup.addChild(this.failGroup);
            if (this.failStyle == 0) {
                this.failImage.source = "common_icon_fail_png"
            } else {
                this.failImage.source = "common_icon_fail2_png"
            }

            this.failLabel.label = this.failText;
        }
    }

    /**
     * 返回被选中的项
     * @returns {Array<any>}
     */
    public get selectedItems():Array<any> {
        var result:Array<any> = [];
        if (this._dataProvider == null) {
            return result;
        }


        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            if (item.selected == true) {
                result.push(item);
            }
        }

        return result;
    }

    /**
     * 返回被选中的项的索引
     * @returns {Array<any>}
     */
    public get selectedIndexArr():Array<number> {
        var result:Array<number> = [];
        if (this._dataProvider == null) {
            return result;
        }

        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            if (item.selected == true) {
                result.push(i);
            }
        }

        return result;
    }


    /**
     * 设置标题的lanId
     *
     * @param index
     * @param val
     */
    public setTitleLanId(index:number, val:string) {
        var t = this.titleGroup.getElementAt(index) as eui.Group;
        if (t == null) {
            throw ("SortList.setTitleLabel()： index超出索引范围")
        }


        var label = t.getElementAt(0) as SortListLabel;
        label.lanId = val;
        label.text = App.Language.getLanText(label.lanId);
    }


    /**
     * 滚动到索引位置，从0开始
     *
     * @param index
     */
    public scrollTo(index:number) {
        this.scrollBar.scrollTo(this.dataGroup, index);
    }


    /**
     * 选择所有项，可通过selectMax设置可选最大值。
     */
    public selectAll() {
        //选择足够的项
        var numSelected:number = 0;
        for (var i = 0; i < this._dataProvider.length; i++) {
            if (this._selectMax != 0 && numSelected >= this._selectMax) {
                break;
            }

            var item = this._dataProvider.getItemAt(i);
            if(item.hasOwnProperty("ignore") && item["ignore"] == true){
                continue;
            }

            if (item.selected == false) {
                item.selected = true;
                item.enabled = true;
                this._dataProvider.replaceItemAt(item, i);
            }
            numSelected++;
        }
        this.updateSelectAllButton();
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    }


    public unselectAll() {
        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            if(item.hasOwnProperty("ignore") && item["ignore"] == true){
                continue;
            }
            if (item.selected == true) {
                item.selected = false;
                item.enabled = true;
                this._dataProvider.replaceItemAt(item, i);
            }
        }

        this.updateSelectAllButton();
        this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
    }


    public setSelected(index:number, b:Boolean) {
        if (index >= this._dataProvider.length) {
            return;
        }

        var item = this._dataProvider.getItemAt(index);
        item.selected = b;
        item.enabled = true;

        this.updateSelectAllButton();
    }

    constructor() {
        super();

        this.contentGroup = new eui.Group();
        this.dataGroup = new List();
        this.scrollBar = new MyScroller();
        // this.addChild(this.scrollBar);
        this.failGroup = new eui.Group();
        this.failImage = new eui.Image();
        this.failLabel = new FontStyle();
        this.failLabel.fontStyle = "LIST_FAIL_LABEL";
        this.failLabel.lanId = "list_fail_default";
        this.failGroup.addChild(this.failImage);
        this.failGroup.addChild(this.failLabel);

        this.failGroup.horizontalCenter = 0;
        this.failGroup.verticalCenter = 0;
        var vl = new eui.VerticalLayout();
        vl.horizontalAlign = egret.HorizontalAlign.CENTER;
        this.failGroup.layout = vl;

        this.addEventListener(eui.UIEvent.COMPLETE, function () {
            this.updateTitleGroup();
        }, this);
    }


    protected commitProperties():void {
        super.commitProperties();

        this.updateArrowIcon();
    }

    protected measure():void {
        super.measure();
    }

    protected childrenCreated():void {
        super.childrenCreated();

        this.updateTitleGroup();

    }

    protected updateTitleGroup() {
        var widthArr:Array<eui.Group> = [];
        if (this.titleGroup != null) {
            this.titleGroup.validateNow();
            for (var i = 0; i < this.titleGroup.numElements; i++) {
                var t = this.titleGroup.getElementAt(i) as eui.Group;

                widthArr[i] = t;
                var label = t.getElementAt(0) as SortListLabel;
                if ((label instanceof SortListLabel) == false) {
                    continue;
                }
                t.touchChildren = false;

                if (label.lanId != "") {
                    label.text = App.Language.getLanText(label.lanId);
                }

                //排序
                if (label.sortProp == "") {
                    continue;
                }

                t.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTitleTouchEnd, this);
            }
        } else {
            console.error("titleGroup is null!")
        }
        if (this.dataGroup != null) {
            this.dataGroup.data = widthArr;
            this.dataGroup.itemRenderer = SortItemRender;
            this.dataGroup.dataProvider = this._dataProvider;
            this.dataGroup.percentWidth = 100;

            this.dataGroup.addEventListener(ItemRenderEvent.SORTLIST_SELECT_BTN_CHANGED, this.onDataGroupSelectChange, this);

            if (this.scrollBar != null) {
                this.scrollBar.percentWidth = 100;
                this.scrollBar.viewport = this.dataGroup;

            }
        }

        if (this.selectAllButton != null) {
            this.selectAllButton.addEventListener(egret.Event.CHANGE, function () {
                if (this.dataGroup != null &&
                    this._dataProvider != null &&
                    this._dataProvider.length > 0) {
                    if (this.selectAllButton.selected == false) {
                        //全否
                        this.unselectAll();
                    } else {
                        this.selectAll();
                    }
                }
            }, this);
        }

        this.addChild(this.titleGroup);
        this.addChild(this.contentGroup);
        this.contentGroup.top = this.titleGroup.y + this.titleGroup.height + 1;
        this.contentGroup.bottom = 1;
        this.contentGroup.percentWidth = 100;
        this.scrollBar.percentWidth = 100;
        this.scrollBar.percentHeight = 100;

    }

    private onDataGroupSelectChange(evt:ItemRenderEvent) {
        if (this._selectionEnabled == false) {
            return;
        }

        if (this._selectionMulti == true) {
            this.updateSelectAllButton();
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        } else {
            var prev = this._selectionIndex;
            if (prev !== -1) {
                var item = this._dataProvider.getItemAt(prev);
                if (prev == evt.index) {
                    if (item.selected == false) {
                        this._selectionIndex = -1;
                    }
                    this.dispatchEvent(evt);
                    return;
                } else {
                    item.selected = false;
                    this._dataProvider.replaceItemAt(item, prev);
                    this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
                }
            }
            this._selectionIndex = evt.index;
        }

        this.dispatchEvent(evt);
    }


    private updateArrowIcon() {
        //更新arrowIcon的位置和状态
        if (this._sortSelected != -1) {
            var labelGroup = this.titleGroup.getChildAt(this._sortSelected) as eui.Group;
            var label = labelGroup.getChildAt(0) as SortListLabel;
            if (this.arrowIcon != null) {
                var gp = label.localToGlobal(0, 0);
                var lp = this.globalToLocal(gp.x, gp.y);
                this.arrowIcon.x = lp.x + label.width;
                this.arrowIcon.y = lp.y;
            }

            if (this._sortDirection == 1) {
                this.arrowIcon.source = "common_list_sort_up_png";
            } else {
                this.arrowIcon.source = "common_list_sort_down_png";
            }
        }
    }

    private onTitleTouchEnd(event:egret.Event) {
        var index = this.titleGroup.getChildIndex(event.target);
        //更新arrowIcon的位置和状态
        var label = event.target.getChildAt(0) as SortListLabel;
        if (this.arrowIcon != null) {
            var gp = label.localToGlobal(0, 0);
            var lp = this.globalToLocal(gp.x, gp.y);
            this.arrowIcon.x = lp.x + label.width;
            this.arrowIcon.y = lp.y;
        }

        this._sortSelected = index;
        if (this.prevSelected == this._sortSelected) {
            this._sortDirection = -this._sortDirection;
        } else {
            this._sortDirection = 1;
        }

        this.prevSelected = this._sortSelected;
        this._sortProp = label.sortProp;
        //更新数据列表的顺序
        if (this.onSort != null) {
            this.onSort(label.sortProp);
            this.dispatchEvent(new SortListEvent(SortListEvent.SORT_PROP_CHANGE));
        } else {
            var list = this._dataProvider.source;
            list.sort(this.sortMyFunc([label.sortProp], [this._sortSelected], this._sortDirection));
            this._dataProvider.refresh();

            //this._dataProvider = new eui.ArrayCollection(list)
            //this.dataGroup.dataProvider = this._dataProvider;
        }

        this.updateArrowIcon();
    }


    private updateSelectAllButton() {
        var numSelected:number = 0;
        var max:number = 0;
        for (var i = 0; i < this._dataProvider.length; i++) {

            var item = this._dataProvider.getItemAt(i);
            if(item.hasOwnProperty("ignore") && item["ignore"] == true){
                continue;
            }
            max++;
            if (item.selected == true) {
                numSelected++;
            }
        }

        this._numSelected = numSelected;

        var max = this._selectMax == 0 ? max : Math.min(this._selectMax, max);

        for (var i = 0; i < this._dataProvider.length; i++) {
            var item = this._dataProvider.getItemAt(i);
            if(item.hasOwnProperty("ignore") && item["ignore"] == true){
                continue;
            }

            if (item.hasOwnProperty("enabled")) {
                if (numSelected >= max) {
                    if (item.selected == false) {
                        if (item.enabled) {
                            item.enabled = false;
                            this._dataProvider.replaceItemAt(item, i);
                        }
                    }
                } else {
                    if (item.enabled == false) {
                        item.enabled = true;
                        this._dataProvider.replaceItemAt(item, i);
                    }
                }
            }
        }


        if (this.selectAllButton != null) {
            if (numSelected >= max) {
                if (this.selectAllButton.selected == false) {
                    this.selectAllButton.selected = true;
                }
            } else {
                if (this.selectAllButton.selected == true) {
                    this.selectAllButton.selected = false;
                }
            }
        }
    }


    public sortMyFunc = function (strarr:any[], sortarr:any[] = null, dir:number) {
        return function (obj1, obj2) {
            var sorlen:number = 0;
            if (sortarr) {
                sorlen = sortarr.length;
            }
            var chanum:number;
            for (var bs in strarr) {
                var b = parseInt(bs);
                chanum = parseInt(obj1[strarr[b]]) - parseInt(obj2[strarr[b]]);
                if (chanum == 0) {

                } else {
                    if (sorlen > b && sortarr[b] == 1) {
                        return chanum * dir;
                    } else {
                        return -chanum * dir;
                    }
                }
            }
            return 0;
        }
    }


    $onRemoveFromStage():void {
        super.$onRemoveFromStage();

        App.TimerManager.remove(this._updateTimer);
    }
}

