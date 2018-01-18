/**
 * Created by zhongguo168a on 2016/7/1.
 *
 */
class RichText extends eui.Group {


    // act:cl : pve:a : arc:bt : st:pl: 带连接的
    public static getTest():string {
        var str = "";
        str += "测试#fdc=155# 图标 #/fdc# #ico=g1#188看看#ico=g1##ico=g1##ico=g1#";
        str += "\n测试#fdc=155# 区域 #/fdc# - #fdc=156# a:[101] #/fdc#看看";
        str += "\n测试#fdc=155# 区域 #/fdc# - #fdc=156# arc:[101|21|12] #/fdc#看看";
        str += "\n测试#fdc=155# 玩家名片 #/fdc# - #fdc=156# pl:[playerid|玩家名字] #/fdc#看看";
        str += "\n测试#fdc=155# 玩家名片 #/fdc# - #fdc=156# pl2:[playerid|玩家名字] #/fdc#看看";
        str += "\n测试#fdc=155# 道具名字 #/fdc# - #fdc=156# i:[道具名字] #/fdc#看看";
        str += "\n测试#fdc=155# 建筑和店铺 #/fdc# - #fdc=156# bt:[1|101|21|12]、st:[1|101|21|12]#/fdc#看看";
        str += "\n测试#fdc=155# 商会和商战 #/fdc# - #fdc=156# cl:[id|商会名字]、pve:[商战]#/fdc#看看";
        str += "\n测试#fdc=155# 员工技能和活动类型 #/fdc# - #fdc=156# sk:[员工技能]、act:[活动类型] #/fdc#看看";
        str += "\n测试#fdc=155# 贸易港口和材料名称 #/fdc# - #fdc=156# pit:[贸易港口]、mt:[材料名称] #/fdc#看看";
        str += "\n测试#fdc=155# 材料交换名名称 #/fdc# - #fdc=156# ME:[id|材料交换名名称] #/fdc#看看";
        return str;
    }









    get fontFamily():string {
        return this._formatTextField.fontFamily;
    }

    set fontFamily(value:string) {
        this._formatTextField.fontFamily = value;
        this.invalidateProperties();

    }

    get textColor():number {
        return this._formatTextField.textColor;
    }

    set textColor(value:number) {
        this._formatTextField.textColor = value;
        this.invalidateProperties();
    }

    get size():number {
        return this._formatTextField.size;
    }

    set size(value:number) {
        this._formatTextField.size = value;
        this.invalidateProperties();
    }


    private _text:string;
    get text():string {
        return this._text;
    }

    set text(value:string) {
        this._text = value;
        this._node = null;
        this.changedFlag = true;
        this.invalidateProperties();
    }


    //是否关闭所有面板
    public panelClosed:boolean = false;

    private _node:RichTextNode = null;
    get node():RichTextNode {
        return this._node;
    }

    set node(value:RichTextNode) {
        this._node = value;
        this._text = null;
        this.changedFlag = true;
        this.invalidateProperties();
    }


    public get textWidth():number{
        if(this.numElements == 0){
            return 0;
        }
        var max = this.getElementAt(0).width;
        for(var i = 1; i < this.numElements; i++){
            max = Math.max(this.getElementAt(i).width, max);
        }

        return max;
    }

    public get textHeight():number{
        if(this.numElements == 0){
            return 0;
        }

        return this.height;
    }

    private _lines:Array<any> = [];
    private _formatTextField:egret.TextField;
    private _labels:Array<any> = [];

    public set formatTextField(value:egret.TextField) {
        if (this._formatTextField == value) {
            return;
        }

        this._formatTextField = value;

        this.invalidateProperties();
    }

    public get formatTextField():egret.TextField {
        return this._formatTextField;
    }


    private cloneFormat():egret.TextField {
        var target = new egret.TextField();
        target.fontFamily = this._formatTextField.fontFamily;
        target.size = this._formatTextField.size;
        target.textColor = this.formatTextField.textColor;
        target.text = "";

        return target;
    }

    constructor() {
        super();

        this._formatTextField = new egret.TextField();
        this._formatTextField.fontFamily = FontColorStyleConst.defaultFont;
        this._formatTextField.size = FontColorStyleConst.chat_fontsize;

        var layout = new eui.VerticalLayout();
        layout.verticalAlign = "middle";
        this.layout = layout;
    }


    protected childrenCreated():void {
        super.childrenCreated();
    }

    protected commitProperties():void {
        super.commitProperties();

        if(this.changedFlag){
            this.changedFlag = false;
            //清除
            this.removeChildren();
            for(var item of this._labels){
                var tf = item as TextField;
                tf.removeEventListener(egret.TextEvent.LINK, this.linkHandler, this);
            }
            //更新
            this.validateNow();
            this.updateLines();
            this.updateDisplay();

            this.dispatchEvent(new egret.Event("RichTextComplete"));
        }

    }


    protected measure():void {
        super.measure();
    }

    private changedFlag = false;
    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);
    }

    protected zero_fill_hex(num, digits) {
        var s = num.toString(16);
        while (s.length < digits)
            s = "0" + s;
        return s;
    }

    private linkHandler(evt:egret.TextEvent ){

        var hrefArr = evt.text.split("#");
        var id = hrefArr[0];
        switch(id){
            case "0"://evt
                var revt = new RichTextCellEvent(RichTextCellEvent.HREF_CLICKED);
                revt.href = hrefArr[1];
                revt.target = this;
                this.dispatchEvent(revt);
                break;
            case "-1"://发送消息者的名片
                //console.log(window.event.clientX,window.event.clientY);
                //this.SendToPlayer(arr_text[1]);
                //this.chat_input.promptDisplay.text = info[2];
                break;
            case "-4"://跳转到地图坐标
                var content = hrefArr[1];
                var arrArea = content.split("|");
                App.MapManager.jumpToArea(parseInt(arrArea[0]), parseInt(arrArea[1]), parseInt(arrArea[2]));
                break;
            case "-5"://打开人物名片
                var content = hrefArr[1];
                var arrArea = content.split("|");
                if(Number(arrArea[0]) != PlayerInfo.getInstance().playerid)
                    PanelManager.instance.popup(PopupFactory.ROLE_CARD_UI,0,{ "playerId": arrArea[0] });
                break;
            case "-6"://打开公司部门
                var content = hrefArr[1];
                var arrArea = content.split("|");
                if(arrArea.length == 2)
                    PanelManager.instance.popup(PopupFactory.COMPANY_MAIN_UI,parseInt(arrArea[0]),{type:parseInt(arrArea[1])});
                break;
            case "-8"://打开商会名片
                var content = hrefArr[1];
                var arrArea = content.split("|");
                PanelManager.instance.popup(PopupFactory.club_info_single,0,{ "ClubId": arrArea[0], "FuncBtns":false });
                break;
            case "-15":
                break;
            default:
                break;
        }

        if(this.panelClosed == true){
            App.PanelManager.closeAll();
        }
    }

    protected updateDisplay() {
        this.touchEnabled = false;
        var lines = this._lines;
        for (var i = 0; i < lines.length; i++) {
            var con = new eui.Group();
            con.touchEnabled = false;
            this.addChild(con);
            var data = lines[i];
            var label = this.cloneFormat();
            label.textFlow = data.flow;
            label.addEventListener( egret.TextEvent.LINK, this.linkHandler, this);
            con.addChild(label);
            this._labels.push(label);
            var max = label.height;
            for (var j = 0; j < data.icons.length; j++) {
                var icon = data.icons[j];

                var image = new eui.Image();
                var res:egret.Texture = RES.getRes(icon.icon);
                image.source = res;
                image.x = icon.x;

                max = Math.max(max, res._bitmapHeight);
                con.addChild(image);
                image.touchEnabled = false;
            }

            con.width = label.width;
            con.height = max;
            label.y = (max - label.height) * 0.5;

            label.touchEnabled = false;
            for(var k = 0; k < data.flow.length; k++){
                if(data.flow[k].style.hasOwnProperty("href")){
                    label.touchEnabled = true;
                    break;
                }
            }
        }
    }


    protected updateLines() {
        var maxWidth = this.width;
        if (maxWidth == 0) {
            maxWidth = -1;
        }

        var root = this._node;
        if(root == null){
            if(this._text == null){
                return;
            }
            var value = this._text;


            root = RichText.parserNode(value);
        }

        //
        var children = root.flat();

        var lines = [];
        var items = [];
        var icons = [];
        var href = "";
        var colorDefault = "";
        var color = "";
        var tf = this.cloneFormat();
        var tf2 = this.cloneFormat();
        RichTextDefine.Color[0] = "0x" + this.zero_fill_hex(tf.textColor, 6);
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            var style = {};
            var text = node.content;
            switch (node.token) {
                case "fdc"://颜色1
                    text = "";
                    colorDefault = RichTextDefine.Color[node.content];
                    continue;
                case "evt"://事件2
                    text = "";
                    href = "event:0#" + node.content;
                    continue;
                case "br":
                    lines.push({"flow": items, icons: icons});
                    items = [];//新行
                    icons = [];
                    tf.text = "";
                    continue;
                    break;
                case "ico"://表情3
                    var icon = RichTextDefine.Icon[node.content];
                    if (icon == null) {
                        console.log("RichEditor 找不到指定的icon url：" + node.content);
                        continue;
                    }
                    var res:egret.Texture = RES.getRes(icon);
                    if (res == null) {
                        console.log("RichEditor 找不到指定的icon res：" + node.content);
                        continue;
                    }
                    tf2.text = "";
                    while (tf2.textWidth < res._bitmapWidth) {
                        tf2.text += " ";
                    }

                    text = tf2.text;
                    if (maxWidth != -1 && tf.textWidth + res._bitmapWidth >= maxWidth) {
                        //换行
                        lines.push({"flow": items, icons: icons});
                        items = [];//新行
                        icons = [];
                        icons.push({x: 0, icon: icon});
                        items.push({text: text, style: style});
                        tf.text = text;
                        continue;
                    } else {
                        icons.push({x: tf.textWidth, icon: icon});
                    }
                    break;
                case "a"://坐标4
                    var areaId = node.content;
                    text = MapConfig.getInstance().getAreaNameByAreaID(parseInt(areaId));
                    color = "0x009403";
                    break;
                case "arc"://坐标4
                    var arr_Area = node.content.split("|");
                    if (arr_Area.length == 3) {
                        text = MapConfig.getInstance().getNameByARC(parseInt(arr_Area[0]), parseInt(arr_Area[1]), parseInt(arr_Area[2]));
                        href = "event:-4#" + node.content;
                        color = "0x009403";
                    }
                    break;
                case "sp:":
                    break;
                case "pl"://名片5
                case "pl2"://名片5
                    var info = node.content.split("|");
                    if (info.length == 2) {
                        text = info[1];
                        href = "event:-5#" + info[0];
                        color = "0x009403";
                        this._formatTextField.size = 22;
                    }
                    break;
                case "com"://公司
                    var info = node.content.split("|");
                    text = info.shift();
                    href = "event:-6#" + info.join("|");
                    color = "0x009403";
                    this._formatTextField.size = 22;
                    break;
                case "i"://道具名称
                    text = "道具：" + node.content;
                    break;
                case "bt"://建筑6
                    var info = node.content.split("|");
                    if (info.length == 4) {
                        var buildType = info[0];
                        info.shift();
                        color = "0x009403";
                        text = App.Language.getBuildingNameByType(parseInt(buildType));
                        href = "event:-4#" + info.join("|");
                    }
                    break;
                case "st"://店铺7
                    var info = node.content.split("|");
                    if (info.length == 4) {
                        var areaId = info[0];
                        info.shift();
                        text = MapConfig.getInstance().getAreaNameByAreaID(parseInt(areaId))+"("+info[1]+","+info[2]+")";
                        color = "0x009403";
                        href = "event:-4#" + info.join("|");
                        this._formatTextField.size = 22;
                    }
                    break;
                case "cl"://商会8
                    var info = node.content.split("|");
                    if (info.length == 2) {
                        text = info[1];
                        color = "0x009403";
                        href = "event:-8#" + info[0];
                    }
                    break;
                case "car"://座驾名称
                    var carId = node.content;
                    text = App.Language.getLanText("Car" + carId);//"座驾：" + str;
                    break;
                case "pve"://商战
                    text = "PveId：" + node.content;
                    break;
                case "sk"://员工技能
                    text = "SkillId：" + node.content;
                    break;
                case "act"://活动类型
                    text = "ActivityType：" + node.content;
                    break;
                case "pit"://贸易港口
                    text = "PortId：" + node.content;
                    break;
                case "mt"://材料名称
                    text = "Mater：" + node.content;
                    break;
                case "ME"://材料交换名名称
                    var info = node.content.split("|");
                    if (info.length == 2) {
                        text = info[1];
                        color = "0x009403";
                        href = "event:-15#" + info[0];
                    }
                    break;
                default:
                    if (node.content == "") {
                        continue;
                    }
            }

            if (colorDefault != "" || color != "") {
                style["textColor"] = color == "" ? colorDefault : color;
                color = "";

            }

            if (href != "") {
                style["href"] = href;
                style["underline"] = true;
                href = "";
            }

            // 解析过长的文本
            while (text.length > 0) {
                tf2.text = text;
                if (maxWidth != -1 && tf.textWidth + tf2.textWidth >= maxWidth) {
                    //换行
                    tf2.text = "";
                    for (var j = 0; j < text.length; j++) {
                        tf2.appendText(text.charAt(j));
                        if (tf.textWidth + tf2.textWidth >= maxWidth) {
                            break;
                        }
                    }

                    var pre = text.substring(0, j);
                    if (pre != "") {
                        tf.appendText(pre);
                        items.push({text: pre, style: style});
                    }
                    lines.push({"flow": items, icons: icons});
                    items = [];//新行
                    icons = [];
                    tf.text = "";
                    text = text.substring(j);
                } else {
                    tf.text = tf.text + text;
                    items.push({text: text, style: style});
                    text = "";
                }
            }

        }
        lines.push({"flow": items, icons: icons});

        this._lines = lines;
    }

    public static parserNode(text:string):RichTextNode {
        text = text.replace(/\\/g,"");

        var regexp = /#ico\=([\d\w]+)#/ig;
        text = text.replace(regexp, "#ico=$1/#");
        regexp = /(ME|mt|pit|act|sk|pve|car|i|arc|sp|pl2|pl|com|bt|st|cl|a)\:\[([^\]]+)\]/ig;
        text = text.replace(regexp, "#$1=$2/#");

        var len = text.length;
        var stack = "";//字符堆栈
        var flagToken = false;//是否处于token模式
        var flagOpen = false;//是否处于token的open状态
        var root = new RichTextNode();
        root.token = "fdc";
        root.content = "0";
        var currentNode:RichTextNode = root;
        var stackToken = [];

        var index = 0;
        while (index < len) {
            var char = text.charAt(index);
            switch (char) {
                case "#":
                    if (flagToken == false) {
                        if (flagOpen == false) {//"->#xxx#", 第一次遇到#
                            //即将进入token模式，把token之前的内容保存
                            if (stack != "") {
                                var node = new RichTextNode();
                                node.content = stack;
                                currentNode.addChild(node);
                                stack = "";
                            }

                            //进入token模式
                            flagToken = true;
                            //处于open状态
                            flagOpen = true;
                            //检查#后面的第一个字符不能为!
                            if (text.charAt(index + 1) == "!") {
                                throw ("RichText parser Error: 开始token“#”后面的第一个字符不能为! text = " + text);
                            }
                        } else {//"#/xxx#"或#xxx#， 第三次遇到#
                            //处于open状态，位于下一个##
                            var c = text.charAt(index + 1);
                            if (c == "/") {//闭合token, #/xxx#
                                //
                                if (stack != "") {
                                    var node = new RichTextNode();
                                    node.content = stack;
                                    stack = "";
                                    currentNode.addChild(node);
                                }
                                //
                                flagToken = true;
                                flagOpen = false;
                                //
                                index++;
                            } else {//嵌套token, #xxx#
                                // 送到堆栈，开始嵌套解析
                                // stackToken.push(currentNode);
                                index--;
                                //进入token模式
                                flagToken = false;
                                //处于open状态
                                flagOpen = false;
                            }
                        }
                    } else {
                        if (flagOpen == true) {//#xxx=xxx#", 第二次遇到#
                            currentNode.content = stack;
                            stack = "";
                            //离开token模式
                            flagToken = false;
                            //
                        } else {//#/xxx#", 第四次遇到#
                            if (currentNode.token != stack) {
                                throw ("RichText parser Error: 开闭token不相等! text = " + text);
                            }
                            //
                            stack = "";

                            if (stackToken.length > 0) {
                                currentNode = stackToken.pop();
                            }
                            //离开token模式
                            flagToken = false;
                            //离开open状态
                            flagOpen = true;
                        }
                    }
                    break;
                case "=":
                    if (flagToken && flagOpen) {//#xxx=xxx#", 遇到"=", 在此方可确认token的值
                        var node = new RichTextNode();
                        node.token = stack;
                        stack = "";
                        currentNode.addChild(node);
                        //
                        stackToken.push(currentNode);
                        currentNode = node;
                    }
                    break;
                case "/":
                    if (flagToken && flagOpen) {//#ico=xx\#, 第二次遇到#之前，遇到/
                        var c = text.charAt(index + 1);
                        index++;
                        if (c != "#") {//闭合token, #/xxx#
                            throw ("RichText parser Error: /#! token = " + currentNode.token);
                        }
                        currentNode.content = stack;
                        stack = "";
                        if (stackToken.length > 0) {
                            currentNode = stackToken.pop();
                        }
                        //离开token模式
                        flagToken = false;
                        //处于open状态
                        flagOpen = true;
                    }
                    break;
                case "\n":
                    if (flagToken == false && flagOpen) {//第三次遇到#之前，遇到\
                        //保存当前行的内容
                        if (stack != "") {
                            var node = new RichTextNode();
                            node.content = stack;
                            stack = "";
                            currentNode.addChild(node);
                        }

                        //添加换行标签
                        var node = new RichTextNode();
                        node.token = "br";
                        currentNode.addChild(node);
                    }

                    break;
                default:
                    stack += char;
            }// end switch;

            index++;
        }// end while;

        if (stack != "") {
            var node = new RichTextNode();
            node.content = stack;
            stack = "";
            currentNode.addChild(node);
        }

        return root;
    }
}


class RichTextNode {
    public token:string = "";
    public content:string = "";

    public parent:RichTextNode;
    public children:Array<RichTextNode> = null;

    public isChecked:boolean = false;

    addChild(value:RichTextNode) {
        if (this.children == null) {
            this.children = [];
        }
        this.children.push(value);
        value.parent = this;
    }

    public flat():Array<RichTextNode> {
        var stack = [];
        stack.push(this);
        var result:Array<RichTextNode> = [];

        while (stack.length > 0) {
            var node = stack.pop();
            result.push(node);
            if (node.children == null || node.isChecked == true) {
                node.isChecked = false;
                continue;
            }
            if (node.token == "fdc") {
                if (node.parent != null) {
                    stack.push(node.parent);
                    node.parent.isChecked = true;
                }
            }

            for (var i = node.children.length - 1; i >= 0; i--) {
                var child = node.children[i];
                stack.push(child);
            }


        }

        return result;
    }
}




