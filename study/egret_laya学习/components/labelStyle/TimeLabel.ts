/**
 * Created by zhongguo168a on 2016/4/9.
 *
 * 时间标签，可以设置倒数
 */
class TimeLabel extends FontStyle {
    private _time:number;
    private _timeReduce:number = 0;
    private _timeStyle:number;
    //显示时间文本的前缀
    private _timePrefix:string;
    private _completeCall:Function;
    private _thisObj:any;
    private _timer:number;
    private _params:any;
    private _timeLanId:string;

    public time():number{
        return this._time;
    }

    constructor() {
        super();

        this.touchEnabled = false;
    }


    /**
     * 设置时间，会自动倒数
     * @param lanId 例如"冷却中:{s0}"，{S0}为通过style生成的时间字符串
     * @param time
     * @param style 跟DateUtils的style一致
     * @param completeCall
     * @param thisObj
     * @param params 完成后传给completeCall的参数
     */
    public setTime(lanId:string, time:number, style:number, completeCall:Function, thisObj:any, ...params) {
        if(this._timer > 0){
            this.clearTime();
        }
        this._time = time;
        this._timeStyle = style;
        this._timeReduce = this.getTimeDif();
        this._completeCall = completeCall;
        this._thisObj = thisObj;
        this._params = params;
        this._timeLanId = lanId;
        this.label = "";
        this.updateTimeLabel();
        if (time > 0 && this._timeReduce != -1) {
            this._timer = App.TimerManager.doTimer(this._timeReduce * 1000, 1, this.onTimeout, this, null, null, true);
        }
    }

    /**
     * 取消时间倒数
     */
    public clearTime(){
        this._completeCall = null;
        this._thisObj = null;
        App.TimerManager.remove(this._timer);

    }

    private getTimeDif():number {
        var result:number;
        switch (this._timeStyle) {
            case 1:
            case 2:
            case 3:
            case 5:
            case 8:
                result = 1;
                break;
            case 7:
                if (this._time > 24 * 3600) {
                    result = -1;
                } else {
                    result = 3600;
                }
                break;
            default:
                result = 60;
        }

        return result;
    }


    protected childrenCreated():void {
        super.childrenCreated();

    }

    private updateTimeLabel(){
        if(this._time == 0){
            this.label = "";
        }else{
            var timestr = DateUtils.getInstance().getFormatBySecond(this._time, this._timeStyle);
            if (this._timeLanId != null) {
                this.label = App.Language.getLanText(this._timeLanId, [timestr]);
            } else {
                this.label = timestr;
            }
        }

    }

    private onTimeout(dif:number) {
        this._timeReduce = this.getTimeDif();
        this._time -= this._timeReduce;
        this.updateTimeLabel();

        if (this._time <= 0) {
            this._completeCall.apply(this._thisObj, this._params);
            this._completeCall = null;
            this._thisObj = null;
            return;
        }

        if (this._timeReduce != -1) {
            this._timer = App.TimerManager.doTimer(this._timeReduce * 1000, 1, this.onTimeout, this, null, null, true);
        }
    }


    $onRemoveFromStage():void {
        super.$onRemoveFromStage();
        this.clearTime();
    }
}