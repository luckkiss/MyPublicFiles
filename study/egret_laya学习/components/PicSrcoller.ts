/**
 *
 * @alpen   
 *  6.29增加垂直排列  皮肤用 PicSrcollerSkinV.exml  在界面皮肤里设置组件Dir=v;
 *
 */
class PicSrcoller extends eui.Component{
    private showDataLength:number;//显示几个内容项
    private listdateLength:number;//数据长度
    private left_img:eui.Image;//左边箭头
    private right_img:eui.Image;//右边箭头
    private scroller:eui.Scroller;//内容列表
    public list:eui.List;//数据列表
    private itemWidth:number;
    private moveDis:number;//根据子对象个数，用来定义点击滚动时的距离
    private listcontendWidth:number;//内容总长度
    private _timer:number = 0;
    
    private listenerFun:Function;
    private listenerObj:any;
    private touchStartPos: number=0;
    public delayScroll: number = 200;
    private curItemCount:number;
    private isSelect:boolean;
    public defaultSelectIndex:number;//默认选择
    private isfirst:boolean;//这个变量用来标识，只第一次会默认点击
    private offsetx:number=10;//拖动5像素，表示不动
    
    private ismove:boolean=false;// 表明滚动了
    
    private scrollDir:string="h";//h,v
    public btnTotalWidth:number;
    
    public _dataProvider:eui.ArrayCollection;
    private customgap:number=-10000;//有自己定义gap
	public constructor() {
    	super();
	}
	public set Dir(dir:string){
        this.scrollDir = dir
        this.invalidateProperties();
	}
    protected childrenCreated(): void {
        super.childrenCreated();
        if(this.scrollDir=="h"){
            this.btnTotalWidth=80;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
        }else{
            this.btnTotalWidth = 24;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
        }
        this.scroller.throwSpeed = 0;
        this.left_img.visible = false;
        this.right_img.visible = false;
        this.list.allowMultipleSelection=false;
       // this.scroller.bounces = false;
    }
	/*
	 * ac:列表的数据源
	 * itemrender:数据项itemrender
	 * itemwidth:条目的宽带
	 * num:显示几个条目
	 * listenerFun:点击条目执行回调
	 * listenerObj
	 */ 
    public setData(ac: eui.ArrayCollection,itemrender: any,itemwidth: number,num: number,index: number = 0,listenerFun: Function = null,listenerObj: any = null,isSelect: boolean = false,setgap: number = -10000):void{
        this.isfirst=true;
    	  this.listenerFun=listenerFun;
        this.listenerObj=listenerObj;
        this._dataProvider=ac;
        this.list.dataProvider = this._dataProvider;
        if(itemrender != null) this.list.itemRenderer = itemrender;
        
        this.listdateLength=this.list.dataProvider.length;
        this.showDataLength = num <= this.listdateLength ? num : this.listdateLength;
        this.curItemCount = index;
        this.isSelect=isSelect;
       
        //**这里有个问题没有解决＊＊，暂时这样处理一下
       
    
        this.itemWidth = itemwidth;
        this.moveDis=this.itemWidth+this.setgap(setgap);
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.clickItem,this);
        this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.onChangeEndHandler,this);
        this.scroller.addEventListener(eui.UIEvent.CHANGE_START,this.onChangeStartHandler,this);
       
        this.defaultSelectIndex=index;
        this.list.selectedIndex=index;
        //this.scroller.visible=false;
        this._timer = TimerManager.getInstance().doTimer(300,1,this.timeCom,this);
	}
    private timeCom() {
        TimerManager.getInstance().remove(this._timer);
        this.scrollToItem(this.defaultSelectIndex,true);
        // this.enabelBtn();
    }
    private onChangeStartHandler(e: eui.UIEvent):void{
        this.ismove=true;
        this.touchStartPos = this.getScrollDis();
    }
    private onChangeEndHandler(e: eui.UIEvent): void {
          if(!this.ismove) return;
          this.ismove=false;
       // this.fixScrollDis();
       // if(Math.abs(this.touchStartPos-this.scroller.viewport.scrollH)<=this.offsetx) return;
       // if((this.scroller.viewport.scrollH + this.scroller.width) >= this.listcontendWidth - this.itemWidth / 2) return;
        var item: number
        if(this.touchStartPos <= this.getScrollDis()+ this.offsetx){
            item = Math.ceil(this.getScrollDis() / this.moveDis);
           
        } else if(this.touchStartPos > this.getScrollDis() - this.offsetx){
            item = Math.floor(this.getScrollDis() / this.moveDis);
        }
        
        this.scrollToItem(item);
        
    }
    private getScrollDis():number{
        return this.scrollDir == "h" ? this.scroller.viewport.scrollH : this.scroller.viewport.scrollV;
    }
    private getScrollWidth():number{
        return this.scrollDir == "h" ? this.getThisWidth() - this.btnTotalWidth: this.scroller.height;
    }
    private getListcontentWidth():number{
        return this.scrollDir == "h" ?this.list.contentWidth:this.list.contentHeight;
    }
    private getListWidth():number{
        return this.scrollDir == "h" ? this.getThisWidth() - this.btnTotalWidth:this.list.height;
    }
    private getThisWidth():number{
        return this.scrollDir == "h" ?this.width:this.height;
    }
    private clickItem(evt: eui.ItemTapEvent=null):void{
        if(this.listenerFun!=null && this.listenerObj){
            if(evt==null){
                this.list.selectedIndex = this.curItemCount;
                this.listenerFun.call(this.listenerObj,{ selectindex: this.curItemCount});
            }else{
                this.listenerFun.call(this.listenerObj,{ selectindex: this.curItemCount,obj: evt.target });
            }
            
        }
    }
    
    /**滑动到下一项*/
    public scrollToNext(): void {
        var item: number = this.curItemCount;
        if(item < this.list.dataProvider.length - 1) {
            item++;
        }
        this.scrollToItem(item);
    }
    /**滑动到上一项*/
    public scrollToLast(): void {
        var item: number = this.curItemCount;
        if(item > 0) {
            item--;
        }
        this.scrollToItem(item);
    }
    
 /**
     * 滚动到指定项 (0是第一项)
     * @item 指定项
     * nodelay:直接跳，不用缓动
     */
    public scrollToItem(item: number,nodelay:boolean=false): void {
        var len: number = this.list.dataProvider.length;
        if(len< this.showDataLength) {
            if(this.scrollDir=="h"){
            this.scroller.viewport.scrollH = (this.moveDis*len - this.getScrollWidth())*.5;
            }else{
                this.scroller.viewport.scrollV = (this.moveDis * len - this.getScrollWidth()) * .5;
            }
            this.scroller.visible = true;
            return;
        }
        if(item >= 0 && item <= len-this.showDataLength) {
            this.curItemCount = item;
           if(this.scrollDir=="h"){
               if(nodelay){
                   this.scroller.viewport.scrollH = item * this.moveDis;
                   this.tweencom();
               }else{
                    egret.Tween.get(this.scroller.viewport).to({ scrollH: item * this.moveDis,ease: egret.Ease.quadOut },this.delayScroll).call(this.tweencom,this);   
            }
        }else{
               if(nodelay) {
                   this.scroller.viewport.scrollV = item * this.moveDis;
                   this.tweencom();
               } else {
                egret.Tween.get(this.scroller.viewport).to({ scrollV: item * this.moveDis,ease: egret.Ease.quadOut },this.delayScroll).call(this.tweencom,this); 
                }
           }
        }else{
            this.enabelBtn();
        }
    }
    public tweencom():void{
        egret.Tween.removeTweens(this.scroller.viewport);
        this.scroller.visible = true;
        if(this.isSelect && this.isfirst) {
            this.clickItem();//是否需要自动点击默认选择项
            this.isfirst=false;
        }
        if(this.showDataLength==1){//如果是一个的话，每次还是要点击的
            this.clickItem();
        }
       // this.clickItem();
       // this.list.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        //this.list.selectedIndex = this.curItemCount;
        this.enabelBtn();
    }
   
    private enabelBtn():void{
        this.listcontendWidth = this.getListcontentWidth();
     if(this.listdateLength<=this.showDataLength){
            this.left_img.visible = false;
            this.right_img.visible = false;
            return;
        }
        //var sc = this.scroller;
        if(this.getScrollDis()<=this.itemWidth/2){
            this.left_img.visible = false;
        }else{
            this.left_img.visible = true;
        }
        
        if((this.getScrollDis() + this.getScrollWidth()) >= this.listcontendWidth - this.itemWidth / 2) {
            this.right_img.visible = false;
        }else{
            this.right_img.visible = true;
        }
    }
    //--更新数据
    /**
   * 添加
   * @param value
   */
    public addDataProvider(value: eui.ArrayCollection): void {
        if(value.length == 0) {
            return;
        }
        for (var i = 0; i < value.length; i++) {
            var data = value.getItemAt(i);
            this._dataProvider.addItem(data);
        }
        this.list.dataProvider = this._dataProvider;
        this.listdateLength = this._dataProvider.length;
        TimerManager.getInstance().doTimer(300,1,this.enabelBtn,this);
    }
    //改变数据
    public changeDataProvider(value:eui.ArrayCollection,num:number=0,selectindex:number=0):void{
       // this.scroller.removeChildren();
       // this.list.dataProvider=null;
        this.defaultSelectIndex=selectindex;
        this.list.selectedIndex = selectindex;
        this._dataProvider = value;
        this.list.dataProvider=value;
        this.isfirst=true;
        this.listdateLength = this.list.dataProvider.length;
        this.showDataLength = num <= this.listdateLength ? num : this.listdateLength;
        this.moveDis = this.itemWidth + this.setgap(this.customgap);
        
        this._timer = TimerManager.getInstance().doTimer(300,1,this.timeCom,this);
        //this.enabelBtn();
    }
    
    private setgap(setgap:number):number{
        var gap: number
        if(setgap == -10000) {
            var thiswidth: number = this.getThisWidth();
            var xx: number = thiswidth - this.btnTotalWidth;
            gap = Math.floor((xx - this.itemWidth * this.showDataLength) / (this.showDataLength + 1));
        } else {
            this.customgap = setgap;
            gap = setgap;
        }
       
        if(this.scrollDir == "h") {
            (this.list.layout as eui.HorizontalLayout).gap = gap;
            (this.list.layout as eui.HorizontalLayout).paddingLeft = gap;
            (this.list.layout as eui.HorizontalLayout).paddingRight = gap;
        } else {
            (this.list.layout as eui.VerticalLayout).gap = gap;
            (this.list.layout as eui.VerticalLayout).paddingTop = gap;
            (this.list.layout as eui.VerticalLayout).paddingBottom = gap;
        }
        return gap;
    }
    public destory():void{
        this.list.removeEventListener(eui.ItemTapEvent.ITEM_TAP,this.clickItem,this);
        this.scroller.removeEventListener(eui.UIEvent.CHANGE_END,this.onChangeEndHandler,this);
        this.scroller.removeEventListener(eui.UIEvent.CHANGE_START,this.onChangeStartHandler,this);
    }
}
