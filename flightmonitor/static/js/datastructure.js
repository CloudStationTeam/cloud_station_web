

class Drone {
    constructor(droneID) {
        this.droneID = droneID;
        this.longitude = null;
        this.latitude = null;
        this.altitude = null;
        this.yaw = null;
        this.pitch = null;
        this.roll = null;
        this.speed = null;
        this.distance = null;
        this.marker = null;
        this.popup = null;
        this.type = null;
        this.flymode = null;
        this.fixType = null;
        this.satellitesVisible = null;
        this.vcc = null;
        this.vservo = null;
    }

    getID() {
        return this.droneID;
    }

    getLocation() {
        if (this.longitude == null || this.latitude == null) {
            return null;
        } else {
            return new Array(this.longitude, this.latitude);
        }
    }

    updateLocation(long, lat) {
        if (long == null || lat == null) {
            console.log("wrong data!");
        } else {
            if (this.longitude == null && this.latitude == null) {
                this.longitude = long;
                this.latitude = lat;
            } else {
                var diffLong = Math.abs(long - this.longitude);
                var diffLat = Math.abs(lat - this.latitude);
                if (diffLong <= 1 && diffLat <= 1) {
                    this.longitude = long;
                    this.latitude = lat;
                } else {
                    console.log("move too fast");
                }
            }
        }
    }

    getLong() {
        return this.longitude;
    }

    getLat() {
        return this.latitude;
    }

    //altitude
    getAltitude() {
        return this.altitude;
    }

    updateAlt(alt) {
        this.altitude = alt;
    }

    // yaw
    getYaw() {
        return this.yaw;
    }

    updateYaw(yaw) {
        this.yaw = yaw;
    }

    // pitch
    getPitch() {
        return this.pitch;
    }

    updatePitch(pitch) {
        this.pitch = pitch;
    }

    // roll
    getRoll() {
        return this.roll;
    }

    updateRoll(roll) {
        this.roll = roll;
    }

    //speed
    getSpeed() {
        return this.speed;
    }

    updateSpeed(speed) {
        this.speed = speed;
    }

    //distance
    getDistance() {
        return this.distance;
    }

    updateDistance(distance) {
        this.distance = distance;
    }

    //marker
    getMarker() {
        return this.marker;
    }

    createMarker(marker) {
        this.marker = marker;
    }

    hasMarker() {
        if (this.marker == null) {
            return false;
        } else {
            return true;
        }
    }

    //popup
    getPopup() {
        return this.popup;
    }

    createPopup(pop) {
        this.popup = pop;
    }

    //type
    getType(){
        return this.type;
    }

    updateType(type){
        this.type = type;
    }

    //flymode
    getFlyMode(){
        return this.flymode;
    }

    updateFlyMode(mode){
        this.flymode = mode;
    }

    //fixType
    getFixType(){
        return this.fixType;
    }

    updateFixType(fix){
        this.fixType = fix;
    }

    //satellitesVisible
    getSatellitesVisible(){
        return this.satellitesVisible;
    }

    updateSatellitesVisible(sat){
        this.satellitesVisible = sat;
    }

    //vcc
    getVcc(){
        return this.vcc;
    }

    updateVcc(vcc){
        this.vcc = vcc;
    }

    //vservo
    getVservo(){
        return this.vservo;
    }

    updateVservo(vser){
        this.vservo = vser;
    }
}


