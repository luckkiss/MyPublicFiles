class TextFlowLabel extends eui.Label {
    private _regexp = /((#([a-z]+)\s*\=\s*\d+#((#([a-z]+)\s*\=\s*\d+#.*?#\/\6#)|[^#])*#\/\3#))/ig;
    private _listerMap:Array<any> = new Array();
    private _style: any;
    private _content: Array<egret.ITextElement>;
    private _touchEnable:boolean;
    private _eventIndex: Array<any>;
    private _label:string="";
    
    public labelColor:any = {
        1205: 0x00FF00,
        1206: 0X034e88,
    };
    public constructor() {
        super();
        this._style = {
            color: 0X034e88,
        }
       
        this.fontFamily = FontColorStyleConst.defaultFont;
    }
    public set fontStyle(v:string) {
        v = "FontColorStyleConst." + v;
        var style = egret.getDefinitionByName(v);
        this._style = style;
        this.invalidateProperties();
    }
    //设置文本
    public set label( label:string){
        if( this._label == label  ){
            return;
        }
        this._label = label;
        this.invalidateProperties();
    }

    public commitProperties(){
        super.commitProperties();
        this.initLabel();
    }

    protected childrenCreated():void {
        super.childrenCreated();

    }
    public initLabel(){
        this._content = new Array();
        this._eventIndex = new Array();
        this._touchEnable = false;

        var textFlow: TextFlowObject =  this.parseText(this._label);
        this.renderTextFlow( textFlow );
        this.textFlow = this._content;
        if( this._touchEnable ){
            this.touchEnabled = true;
            this.addEventListener(egret.TextEvent.LINK,this.onListerEvent,this);
        }
    }
    //点击连接
    public onListerEvent(evt: egret.TextEvent ){
        var eventIndex = evt.text;
        if(this._listerMap[eventIndex]){
            this._listerMap[eventIndex][0].call(this._listerMap[eventIndex][1],this._eventIndex[eventIndex]);
        }else{
            this.onTxTouchEvent.call(this, this._eventIndex[eventIndex] );
        }
    }
    //添加监听
    public addListerEvent( touchEvent:Array<Function>,target?:Object){
        if(touchEvent.length>0){
            for(var i in touchEvent ){
                this._listerMap[i]=[touchEvent[i],target];
            }
        }
    }
    //移除监听
    public removeListerEvent(){
        if(  this.touchEnabled ){
            this.removeEventListener(egret.TextEvent.LINK,this.onListerEvent,this);
        }
    }
    //分析内容
    public parseText(text: string): TextFlowObject{
        var object = new TextFlowObject(); 
        object.Tag = this.parseTag(text);
        //查找标签
        var reg = object.Tag.TagContent.match(this._regexp);
    
        if( reg && reg.length>0){
            object.Content = object.Tag.TagContent.replace(this._regexp,"#@#").replace(/(^#)|(#$)/g,"");
            object.Node = new Array();
            for(var i = 0;i < reg.length;i++){
                object.Node.push(this.parseText(reg[i]));
            }
        }
        return object;
    }
    //分析标签
    public parseTag(text: string): TextFlowTag{
        var TextTag: TextFlowTag = new TextFlowTag();
        TextTag.TagContent = text;
   
        var reg = text.match(this._regexp);
        if( reg && reg.length == 1 && text[0] =="#" ){        
            var regexp = /(^#[a-z]+\s*=\s*\d*#([a-z]+:\[.*\])*)|(#\/[a-z]+#$)/ig;
            var Tag = TextTag.TagContent.match(regexp);
            
            if(Tag.length == 2) {
                var TagSourse = Tag[0]; //标签头部
                var splitSoure = TagSourse.split("#");
                TextTag.TagContent = TextTag.TagContent.replace(regexp,"");
                if(splitSoure[1]) {
                    [TextTag.TagName,TextTag.TagArg] = this.parseTagName(splitSoure[1]);
                }
                if(splitSoure[2]) {
                    [TextTag.TagProName,TextTag.TagProArgs] = this.parseTagPro(splitSoure[2]);
                }
            }
        }
        return TextTag;
    }
    //标签内容
    public parseTagName(rSoureText: string):Array<any>{
        var Name,Args='';
        var splitTagHead = rSoureText.split("=");
        if(splitTagHead.length > 0) {
            Name = splitTagHead[0];
            if(splitTagHead.length > 1) {
                Args = splitTagHead[1].replace(/(^\s*)|(\s*$)/g,"");
            }
        }
        return [Name,Args];
    }
    //标签属性
    public parseTagPro(rSoureText: string): Array<any>{
        var Name,Args = '';
        var splitTagHead = rSoureText.split(":");
        if(splitTagHead.length > 0) {
            Name = splitTagHead[0];
            if(splitTagHead.length > 1) {
                Args = splitTagHead[1].replace(/(^\[)|(\]$)/g,"");
            }
        }
        return [Name,Args];
    }
    //设置样式
    public setTextStyle(text: string,tag: any,parentTag?: any): egret.ITextElement{
        var style = this.getTextStyle(tag,parentTag);
        var textArray: egret.ITextElement = {
            text: text,
            style: style,
        };
        this._content.push(textArray);
        return textArray;
    }
    //获取样式
    public getTextStyle(tag: any,parentTag?: any): TextFlowOStyle{
        var style: TextFlowOStyle = new TextFlowOStyle();
        //style.size = this._refalutFont.size;
        var textColor= null;
        if(parentTag && parentTag['Style']) {
            style.textColor = parentTag['Style']['textColor'];
        } else {
            style.textColor = this._style.color;
        }
        if(tag) {
            [textColor,style.underline,style.href] = this.typeStyle(tag);
        }
        if( textColor ){
            style.textColor = textColor;
        }
        return style;
    }
    //分析标签
    public typeStyle(tag: any): Array<any>{
        var textColor = '';
        var underline = false;
        var href ="";
        if( tag.TagName == 'fdc') {
            textColor = this.labelColor[tag.TagArg];
        }
        if( tag.TagName == 'evt') {
            underline = true;
            var herfArgs = [tag.TagName,tag.TagArg,tag.TagProName, tag.TagProArgs];
            href = "event:" + this._eventIndex.length;
            this._touchEnable = true;
            this._eventIndex.push( herfArgs );
        }
        return [textColor,underline,href];
    }
    //渲染内容
    public renderTextFlow(TextFlow: TextFlowObject,ParentTag?:any){
        var tag = TextFlow['Tag'];
        if(TextFlow['Content']){
            var splitString = TextFlow['Content'].split("#");
            if( splitString.length>0 ){
                var i = 0;
                for(var j in splitString) {
                    if(splitString[j]) {
                        if(splitString[j] == '@' && TextFlow['Node']) {
                            TextFlow['Tag']['Style'] = this.getTextStyle(tag,ParentTag);
                            this.renderTextFlow(TextFlow['Node'][i] as TextFlowObject,tag);
                            i++;
                        } else {
                            var textStyle = this.setTextStyle(splitString[j],tag);
                            TextFlow['Tag']['Style'] = textStyle.style as TextFlowOStyle;
                        }
                    }
                }
            }
        }else{
            var textStyle = this.setTextStyle(tag.TagContent,TextFlow['Tag'],ParentTag);
            TextFlow['Tag']['Style'] = textStyle.style as TextFlowOStyle;
        }

    }

    public onTxTouchEvent( agrs:any ):void{
        var tagName = agrs[0];
        var tagType = Number(agrs[1]);
        var tagArgs = {};
        if( agrs[2]){
            tagArgs[agrs[2]] = agrs[3];
        }
        switch(agrs[0]) {
            case "evt":
                this.targerEvent.call(this,tagType,tagArgs);
                break;
            default:
                //console.log("事件ID",arr_args[0]);
                break;
        }
        
    }
    public targerEvent( tagType,agrs?:Array<any>){
        switch( tagType ) {
            case 1: //打开角色名片
                CommonTipManager.instance.shopTip(App.Language.getLanText( "打开角色名片"+agrs['pid']),1);
                break;
            case 8: //打开商会
                PanelManager.instance.popup(PopupFactory.club_info_single,0,{ "ClubId": agrs['cid'],"FuncBtns":false});
                break;
            default:
                CommonTipManager.instance.shopTip(App.Language.getLanText( "未知事件"+tagType),0);
                break;
        }
    }

    $onRemoveFromStage(): void {
        this.removeListerEvent();
    }
}

class TextFlowObject {
    public Content: string; //内容
    public Node: Array<Object>; //子节点
    public Tag: TextFlowTag;
}


class TextFlowOStyle implements egret.ITextStyle {
    public textColor: number;
    public size: number;
    public href: string;
    public underline: boolean;
}

class TextFlowTag {
    public TagContent: string; //标签内容
    public TagName: string;  //标签参数
    public TagArg: string;   //标签名称
    public TagProName: string; //标签属性
    public TagProArgs: string; //标签参数
    public Style: TextFlowOStyle;//标签样式
}
