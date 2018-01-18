/**
 * Created by zhongguo168a on 2016/7/1.
 *
 */
class RichArea extends eui.DataGroup {

    static getTestRichText():RichArea {
        var rich = new RichArea();
        rich.formatTextField.textColor = 0x000022;
        rich.formatTextField.size = 20;
        rich.appendLine("测试#fdc=155# 图标 #/fdc# #ico=g1#188看看#ico=g1##ico=g1##ico=g1#");
        rich.appendLine("测试#fdc=155# 区域 #/fdc# - #fdc=156# a:[101] #/fdc#看看");
        rich.appendLine("测试#fdc=155# 区域 #/fdc# - #fdc=156# arc:[101|21|12] #/fdc#看看arc:[101|21|12]有没有搞错超出一行会发生什么？");
        rich.appendLine("测试#fdc=155# 玩家名片 #/fdc# - #fdc=156# pl:[101|21|12] #/fdc#看看超出一行会发生什么？超出一行会发生什么？超出两行会发生什么？超出两行会发生什么？超出两行会发生什么？超出三行呢呢呢？超出三行呢呢呢？超出三行呢呢呢？超出三行呢呢呢？");
        rich.appendLine("测试#fdc=155# 玩家名片 #/fdc# - #fdc=156# pl2:[playerid|玩家名字] #/fdc#看看");
        rich.appendLine("测试#fdc=155# 道具名字 #/fdc# - #fdc=156# i:[道具名字] #/fdc#看看");
        rich.appendLine("测试#fdc=155# 建筑和店铺 #/fdc# - #fdc=156# bt:[1|101|21|12]、st:[1|101|21|12]#/fdc#看看");
        rich.appendLine("测试#fdc=155# 商会和商战 #/fdc# - #fdc=156# cl:[id|商会名字]、pve:[商战]#/fdc#看看");
        rich.appendLine("测试#fdc=155# 员工技能和活动类型 #/fdc# - #fdc=156# sk:[员工技能]、act:[活动类型] #/fdc#看看");
        rich.appendLine("测试#fdc=155# 贸易港口和材料名称 #/fdc# - #fdc=156# pit:[贸易港口]、mt:[材料名称] #/fdc#看看");
        rich.appendLine("测试#fdc=155# 材料交换名名称 #/fdc# - #fdc=156# ME:[id|材料交换名名称] #/fdc#看看");
        return rich;
    }


    private _formatTextField:egret.TextField;

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

        this.itemRenderer = RichTextCell;
        this.itemRendererSkinName = "RichTextCellSkin";

        this.dataProvider = new eui.ArrayCollection([]);
        this._formatTextField = new egret.TextField();
        this._formatTextField.fontFamily = FontColorStyleConst.defaultFont;
        this._formatTextField.size = FontColorStyleConst.chat_fontsize;
    }

    private _textLines:Array<string> = [];
    private _line:number = 0;

    /**
     *
     * @param value
     */
    public appendLine(value:string) {
        this._textLines.push(value);

        this.invalidateProperties();
    }


    protected childrenCreated():void {
        super.childrenCreated();

        this.addEventListener(RichTextCellEvent.HREF_CLICKED, function (evt) {
            console.log(evt.href);
        }, this);
    }

    protected commitProperties():void {
        super.commitProperties();

    }

    protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);

        this.updateDataProvider();
    }


    protected updateDataProvider() {
        this._line = 0;
        this.dataProvider = new ArrayCollection();
        while (this._line < this._textLines.length) {
            var value = this._textLines[this._line];
            this._updateDataProvider(value);
            this._line++;
        }
    }

    protected zero_fill_hex(num, digits) {
        var s = num.toString(16);
        while (s.length < digits)
            s = "0" + s;
        return s;
    }

    protected _updateDataProvider(value:string) {
        var dataProvider = this.dataProvider as eui.ArrayCollection;

        var regexp = /#ico\=([\d\w]+)#/ig;
        value = value.replace(regexp, "#ico=$1/#");
        regexp = /(ME|mt|pit|act|sk|pve|car|i|arc|sp|pl2|pl|com|bt|st|cl|a)\:\[([^\]]+)\]/ig;
        value = value.replace(regexp, "#$1=$2/#");
        //
        var root = this._parser(value);
        var children = root.flat();

        var items = [];
        var icons = [];
        var href = "";
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
                    color = RichTextDefine.Color[node.content];
                    continue;
                case "evt"://事件2
                    text = "";
                    href = node.content;
                    continue;
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
                    while (tf2.textWidth < res.bitmapData.width) {
                        tf2.text += " ";
                    }

                    text = tf2.text;
                    if (tf.textWidth + res.bitmapData.width >= this.width) {
                        //换行
                        dataProvider.addItem({"flow": items, icons: icons});
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
                    break;
                case "arc"://坐标4
                    var arr_Area = node.content.split("|");
                    if (arr_Area.length == 3) {
                        text = MapConfig.getInstance().getNameByARC(parseInt(arr_Area[0]), parseInt(arr_Area[1]), parseInt(arr_Area[2]));
                        href = "event:-4#" + node.content;
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
                    }
                    break;
                case "i"://道具名称
                    text = "道具：" + node.content;
                    break;
                case "bt"://建筑6
                    var info = node.content.split("|");
                    if (info.length == 4) {
                        var buildType = info[0];
                        info.shift();
                        text = App.Language.getBuildingNameByType(parseInt(buildType));
                        href = "event:-4#" + info.join("|");
                    }
                    break;
                case "st"://店铺7
                    var info = node.content.split("|");
                    if (info.length == 4) {
                        var shopType = info[0];
                        info.shift();
                        text = App.Language.getShopNameByType(parseInt(shopType));
                        href = "event:-4#" + info.join("|");
                    }
                    break;
                case "cl"://商会8
                    var info = node.content.split("|");
                    if (info.length == 2) {
                        text = info[1];
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
                        href = "event:-15#" + info[0];
                    }
                    break;
                default:
                    if (node.content == "") {
                        continue;
                    }
            }

            if (color != "") {
                style["textColor"] = color;
            }

            if (href != "") {
                style["href"] = href;
                style["underline"] = true;
                href = "";
            }

            // 解析过长的文本
            while (text.length > 0) {
                tf2.text = text;
                if (tf.textWidth + tf2.textWidth >= this.width) {
                    //换行
                    tf2.text = "";
                    for (var j = 0; j < text.length; j++) {
                        tf2.appendText(text.charAt(j));
                        if (tf.textWidth + tf2.textWidth >= this.width) {
                            break;
                        }
                    }

                    var pre = text.substring(0, j);
                    if (pre != "") {
                        tf.appendText(pre);
                        items.push({text: pre, style: style});
                    }
                    dataProvider.addItem({"flow": items, icons: icons});
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
        dataProvider.addItem({"flow": items, icons: icons});
        this.dataProvider = dataProvider;
    }

    private _parser(text:string, index:number = 0):RichTextNode {
        var len = text.length;
        var stack = "";//字符堆栈
        var flagToken = false;//是否处于token模式
        var flagOpen = false;//是否处于token的open状态
        var root = new RichTextNode();
        root.token = "fdc";
        root.content = "0";
        var currentNode:RichTextNode = root;
        var stackToken = [];

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
                    if (flagToken && flagOpen) {//#ico=xx\#, 第二次遇到#之前，遇到\
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

