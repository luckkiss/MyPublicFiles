/**
 * Created by zhongguo168a on 2016/5/18.
 */


class RichTextCellEvent extends egret.Event{

    public static HREF_CLICKED:string = "HREF_CLICK";

    /**
     *
     */
    public href:string;

    public richText:RichText;

    constructor(type:string, bubbles?:boolean, cancelable?:boolean, data?:any) {
        super(type, bubbles, cancelable, data);
    }
}