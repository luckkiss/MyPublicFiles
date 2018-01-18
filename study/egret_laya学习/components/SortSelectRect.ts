/**
 * Created by zhongguo168a on 2016/6/27.
 */


class SortSelectRect extends eui.Rect{

    /**
     * 从标题的第index个group开始，生成点击范围，索引从0开始
     */
    public titleIndex:number = 0;

    constructor(width:number, height:number, fillColor:number) {
        super(width, height, fillColor);
    }


}   