/**
 *
 * @RXHuang
 *
 */
class LanLabel extends eui.Label {
    public constructor() {
        super();

        this.touchEnabled = false;
    }

    private _lanId:string = "";

    public set lanId(v:string) {
        this._lanId = v;
        this.text = App.Language.getLanText(this._lanId);
    }

    public get landId():string {
        return this._lanId;
    }

    protected childrenCreated():void {
        super.childrenCreated();
        //添加视图初始化逻辑
        if (this._lanId != "") {
            this.text = App.Language.getLanText(this._lanId);
        }

    }

}
