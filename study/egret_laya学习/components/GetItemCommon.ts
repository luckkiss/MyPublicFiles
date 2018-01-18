/**
 *
 * @alpen  道具的获取途径公共面板 
 *
 */
class GetItemCommon extends BaseContent {
    private itemId:number;//需要的道具id
    private item_info:FontStyle;//描述信息
    private itemIcon:ItemImage;//道具图标
    private itemtype: number;//显示道具的类型
    private item_list:eui.List;
    private comeFrom:Array<any>;//道具来源
    
    private arrData:Array<any>;
    public constructor(_parent: egret.DisplayObjectContainer,itemtype:number,itemId:number) {
        super(_parent);
        this.itemtype=itemtype;
        this.itemId=itemId;
        this.arrData=[];
        this.skinName = GlobalConst.modelSkinPath + "component_skins/GetItemCommonSkin.exml";
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        
        switch(this.itemtype){
            case EnumItemType.ItemType_VIPCard:
                    this.comeFrom=eval(TB_CONFIG_ITEM.instance.getItem(this.itemId).Come);
                    this.item_info.label = App.Language.getLanText("vip_privilege_info");
                    this.itemIcon.icon = "resource/assets/item/item_vip_01.png";
                    for(var i:number=0;i<this.comeFrom.length;++i){
                        var comelabel: string = App.Language.getLanText("Sources_Item_cell_" + this.comeFrom[i]);
                        var intro: string = App.Language.getLanText("Sources_Item_cell_vip_" + this.comeFrom[i],null,true);
                        this.arrData.push({"label":comelabel,"intro":intro,"gotoId":this.comeFrom[i]});
                    }
            break;
        }
        
        this.item_list.itemRenderer=GetItemCommonItemRender;
        this.item_list.dataProvider = new ArrayCollection(this.arrData);
    }
}
