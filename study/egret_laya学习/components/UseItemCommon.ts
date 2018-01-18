/**
 *
 * @alpen  使用道具公共面板 
 *
 */
class UseItemCommon extends BaseContent {
    private tip_txt:FontStyle;
    private tip:string;//提示内容
    private itemArray:any;
    private itemtype:number;//显示道具的类型
    private item_list:eui.List;
    private roleinfo:RoleInfo;
    public constructor(_parent: egret.DisplayObjectContainer,tip:string,item:any,itemtype:number,roleinfo:RoleInfo) {
        super(_parent);
        this.tip=tip;
        this.itemArray=item;
        this.itemtype=itemtype
        this.roleinfo=roleinfo;
        this.skinName = GlobalConst.modelSkinPath + "component_skins/UseItemCommonSkin.exml";
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.tip_txt.label=this.tip;
        this.setlist();
    }
    private setlist():void{
        switch(this.itemtype){
            case EnumItemType.ItemType_VIPCard:
            var VipItem:any=TB_CONFIG_PUBLIC.instance.getVipItemCard();
            var arr:Array<any>=[];
            for(var key in this.itemArray){
                arr.push({ "itemClass": new ItemClass(Number(key)),"num": this.itemArray[key],
                    "itemtype": this.itemtype,"level": VipItem[key]["Level"],"key":key,"roleinfo":this.roleinfo,
                    "time":VipItem[key]["Time"],"isheightest":this.ifHeightest(Number(key))});
            }
            break;
        }
        this.item_list.itemRenderer = UseCardItemRender;
        this.item_list.dataProvider = new ArrayCollection(arr);
    }
    //--判断是不是当前最高的vip卡
    private ifHeightest(id:number):boolean{
        for(var key in this.itemArray){
            if(id<Number(key)) return false;
        }
        return true;
    }
}
