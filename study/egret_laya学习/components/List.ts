/**
 * Created by zhongguo168a on 2016/3/25.
 */

class List extends eui.List{

    /**
     * 提供给渲染器使用的数据
     */
    public data:any = {};
    constructor() {
        super();
    }

    protected rendererAdded(renderer: eui.IItemRenderer, index: number, item: any): void{
        super.rendererAdded(renderer, index, item);
    }

}