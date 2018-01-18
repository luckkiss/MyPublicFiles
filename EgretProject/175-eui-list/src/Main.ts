/**
 * @copyright www.egret.com
 * @author dily
 * @desc EUIlist
 *      EUIlist使用方法
 */

class Main extends eui.UILayer {
   
    protected createChildren(): void {
        super.createChildren();
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
       
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private createScene(){
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            this.startCreateScene();
        }
    }
    
    private _txInfo:egret.TextField;
    private list:eui.List;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        
        var gr = new eui.Group();
        gr.cacheAsBitmap = true;
        this.addChild(gr);

        for(var i =0;i<5555;i++){
            var img = new MyChouMa();
            var fromXX = this.randomIntN(0,640);
            var fromYY = this.randomIntN(0,1136);
            var toXX = this.randomIntN(0,640);
            var toYY = this.randomIntN(0,1136);
            img.x = fromXX;
            img.y = fromYY;
            egret.Tween.get(img,{loop:true}).
            to({x:toXX,y:toYY},500).
            wait(500).
            to({x:fromXX,y:fromYY},500);
            gr.addChild(img);
            
        }
    }

    public randomIntN(n: number, m: number): number {
        return Math.random() * (m - n) + n;
    }
}

class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    public getAsset(source: string, compFunc:Function, thisObject: any): void {
        function onGetRes(data: any): void {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    }
}

class ThemeAdapter implements eui.IThemeAdapter {

    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    public getTheme(url:string,compFunc:Function,errorFunc:Function,thisObject:any):void {
        function onGetRes(e:string):void {
            compFunc.call(thisObject, e);
        }
        function onError(e:RES.ResourceEvent):void {
            if(e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                errorFunc.call(thisObject);
            }
        }
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
        RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
    }
}

class MyChouMa extends eui.Component{

    public list:eui.List;

    constructor(){
        super();

        this.skinName = "resource/eui_skins/MyChouMaSkin.exml";
    }


}