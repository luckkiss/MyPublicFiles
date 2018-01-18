/**
 * Created by zhongguo168a on 2016/3/21.
 */


class SortListLabel extends eui.Label{
    //点击进行排序的属性
    public sortProp:string = "";

    //语言包对应的Id
    public lanId:string = "";

    constructor(text:string) {
        super(text);

        this.fontFamily = "微软雅黑";
        this.touchEnabled = false;
    }


    protected childrenCreated():void {
        super.childrenCreated();
    }
}