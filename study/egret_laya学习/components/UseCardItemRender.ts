/**
 *
 * @alpen,,特权提示－－使用卡 
 *
 */
class UseCardItemRender extends eui.ItemRenderer{
    private playerVipLV:number;
    private name_label:FontStyle;
    private intro_label:FontStyle;
    private icon_img:ItemImage;
    private use_btn:MyButton;
    
    private isHeightest:boolean;//是否为最高级卡
    private roleinfo:RoleInfo;
	public constructor() {
    	super();
        this.skinName = "resource/skins/ui_skins/roleskins/UseCardItemRenderSkin.exml";
    }
    protected childrenCreated(): void {
        super.childrenCreated();
        this.playerVipLV=PlayerInfo.getInstance().viplevel;
    }
    protected dataChanged(): void {
        super.dataChanged();
        var itemClass: ItemClass = this.data.itemClass as ItemClass;
        this.name_label.label=itemClass.ItemName;
        this.intro_label.label=itemClass.ItemIntro;
        this.icon_img.icon ="resource/assets/item/"+itemClass.IcoId;
        this.roleinfo = this.data.roleinfo;
        this.icon_img.num = this.data.num;
        this.use_btn.label = App.Language.getLanText("PackUse");
        this.use_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.UseHandle,this);
    }
    private UseHandle():void{
        var tip:string;
        var vipname:string;
        if(this.isHeightest){//有更高级的卡
            tip = App.Language.getLanText("privilege_promt_type_3",[this.data.itemClass.ItemName]);
        }else{
          if(this.playerVipLV==0){//当前没有卡，随便用
              vipname=App.Language.getLanText("privilege_level"+this.data.level);
              
              tip = App.Language.getLanText("privilege_promt_type_1",
                  [vipname,DateUtils.getInstance().getDaysbySec(this.data.time)]);
          } else if(this.playerVipLV==this.data.level){//要用的卡，等下当前有的，，增加时间
              tip = App.Language.getLanText("privilege_promt_type_2",
                  [App.Language.getLanText("privilege_level" + this.playerVipLV),
                App.Language.getLanText("privilege_level" + this.playerVipLV),
                DateUtils.getInstance().getDaysbySec(this.data.time)]);
          }else{//使用其他的高级卡
              tip = App.Language.getLanText("privilege_promt_type_4",[
                  App.Language.getLanText("privilege_level" + this.data.level),
                  App.Language.getLanText("privilege_level" + this.playerVipLV),
                  DateUtils.getInstance().getDaysbySec(this.data.time)]);
          }
        }

        App.MsgBoxManager.msgboxSubmit(tip,null, this.okfun,null,this);
    }
    private okfun():void{
        App.Http.send(HttpConst.ItemUI_UseItem,{"IId":this.data.key},this.useReturn,this);
    }
    private useReturn(obj:any):void{
        if(this.data.level>this.playerVipLV){
           // m_iIsCanGetGift = 1;这个是什么？
            this.roleinfo.VLT = this.data.time;
            //出个动画表示一下
            AniFactory.getInstance().CreateAni({ "type": EnumAniType.role_privilege,"vipId": Number(this.data.level) });
        }else{
            this.roleinfo.VLT+=this.data.time;
        }
        PlayerInfo.getInstance().setVipLevel(this.data.level);
    }
}
