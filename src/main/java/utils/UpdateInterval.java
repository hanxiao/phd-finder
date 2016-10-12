package utils;

/**
 * Created by hxiao on 15/8/16.
 */
public enum UpdateInterval {
    DAY (86400000),
    HOUR (3600000),
    MINUTE (60000);

    private long numVal;

    UpdateInterval(long numVal) {
        this.numVal = numVal;
    }

    public long getNumVal() {
        return numVal;
    }
}
