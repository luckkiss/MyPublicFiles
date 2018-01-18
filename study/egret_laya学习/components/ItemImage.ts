/**
 *
 * @alpen 道具类统一显示 
 *
 */
class ItemImage extends eui.Component{
    private id:number;//道具id
    private bg_img:eui.Image;//道具框，，，根据配置
    private _icon:eui.Image;//道具图标
    private _iconPath: string | egret.Texture;
    private num_label:FontStyle;//道具数量
    private numTxt:string;
	public constructor() {
    	   super();
         this.skinName = GlobalConst.modelSkinPath + "component_skins/itemImageSkin.exml";
	}
    protected childrenCreated(): void {
        super.childrenCreated();
        if(this._icon)
            this._icon.source = this._iconPath;
        if(this.num_label)
            this.num_label.label = this.numTxt;
    }
    
    public set icon(icon:string | egret.Texture){
        this._iconPath=icon;
        if(this._icon)
            this._icon.source = this._iconPath;
    }
    public set num(num:string){
        this.numTxt=num;
        this.num_label.visible=true;
        if(this.num_label)
        this.num_label.label=num;
    }
}
