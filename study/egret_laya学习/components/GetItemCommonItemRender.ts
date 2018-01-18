/**
 *
 * @alpen,,特权提示－－使用卡 
 *
 */
class GetItemCommonItemRender extends eui.ItemRenderer{
    private come_label:FontStyle;
    private intro_label:FontStyle;
    private go_btn:MyButton;
    private gotoID:number;
	public constructor() {
    	super();
        this.skinName = "resource/skins/ui_skins/roleskins/GetItemCommonItemRenderSkin.exml";
    }
    protected childrenCreated(): void {
        super.childrenCreated();

    }
    protected dataChanged(): void {
        super.dataChanged();
        this.come_label.label=this.data.label;
       this.intro_label.label=this.data.intro;
       this.gotoID = Number(this.data.gotoId);
       this.go_btn.label=App.Language.getLanText("Sources_Item_cell_btn");
       this.go_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gotoHandle,this)
    }
    
    private gotoHandle():void{
        switch(this.gotoID){
            //商海决战
            case 1:
                CommonTipManager.instance.shopTip("前往－－商海决战");
            break;

            //开启保险箱
            case 2: 
                CommonTipManager.instance.shopTip("前往－－开启保险箱");
            break;

            //商会仓库获赠
            case 3: 
                PanelManager.instance.popup(PopupFactory.club_warehouse);
               // CommonTipManager.instance.shopTip("前往－－商会仓库获赠");
             break;

            //商会兑换
            case 4: 
                CommonTipManager.instance.shopTip("前往－－商会兑换"); 
            break;

            //商城购买
            case 5: 
                CommonTipManager.instance.shopTip("前往－－商城购买"); 
            break;

            //合成
            case 6: 
                CommonTipManager.instance.shopTip("前往－－合成");  
            break;

            //商会竞技
            case 7: 
                CommonTipManager.instance.shopTip("前往－－商会竞技");
            break;

            //PS:如果新添加要跟后端统一定义好Com    
            default: 
                CommonTipManager.instance.shopTip("前往－－"+this.gotoID);
            break;

        }
        App.MsgBoxManager.closeMsgBox();
    }
}
