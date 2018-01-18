/**
 *图片自动旋转组件
 * 只要设定source属性就可以，source只能是资源的字符串
 * @RXHuang
 *
 */
class RotateImage extends eui.Component{
    public rotate_image:eui.Image;
    private _cycletime:number = 2000;//旋转一周的时间，单位毫秒，默认2000毫秒
    private _source:string;
	public constructor() {
        super();
        
	}
	
	public set source(s:string){
    	this._source = s;
	}

    public get source():string{
        return this._source;
        
    }

    //旋转一周的时间，单位毫秒
    public set cycletime(ct:number){
        this._cycletime = ct;
    }

    public get cycletime():number{
        return this._cycletime;
    }
	
    protected updateDisplayList(unscaledWidth: number,unscaledHeight: number): void {
        super.updateDisplayList(unscaledWidth,unscaledHeight);
        
    }
	
    protected childrenCreated(): void {
        super.childrenCreated();
        //此方法需要预加载资源
        /*var texture = RES.getRes("ui_club_war_item_light_bg_large_png");
        var i = new eui.Image();
        i.texture = texture;
        console.log("img",i.width,i.height);*/
        //此方法是异步加载资源
        /*RES.getResAsync("ui_club_war_item_light_bg_large_png",function(data: any,key: string) {
            var i = new eui.Image();
            i.texture = RES.getRes(key);
            //if(data.bitmapData){i.texture = data.bitmapData;}
            
            console.log("img",i.width,i.height);
        },this);*/
        
        if(!this.rotate_image) {
            this.rotate_image = new eui.Image(this._source);
            this.addChild(this.rotate_image);
        }else{
            this.rotate_image.source = this._source;
        }

        this.rotate_image.width = this.width;//通过皮肤中的width和height定位
        this.rotate_image.height = this.height;
        this.rotate_image.anchorOffsetX = this.rotate_image.width * 0.5;
        this.rotate_image.anchorOffsetY = this.rotate_image.height * 0.5;
        this.rotate_image.x = this.rotate_image.width * 0.5;
        this.rotate_image.y = this.rotate_image.height * 0.5;
        var tw = egret.Tween.get(this.rotate_image,{ loop: true });//获取旋转对象，定义循环动画
        tw.to({ rotation: -360 },this._cycletime);
        
    }
    
    
}
