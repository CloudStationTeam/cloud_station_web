class WebDrone { // Cloudstation 4.0
    // mirrors models.py in Django for ease of management....
    constructor(droneID) {
        this.droneID = droneID; // droneID is the same as the port for now
        this.drone_local_IP = null; 
        this.drone_remote_IP = null;
        this.vehicle_type = null;
        this.last_seen = null; // number of milliseconds since January 1, 1970
        this.is_connected = null;
        this.MAV_TYPE = null;
        this.base_mode = null;
        this.custom_mode = null;
        this.voltage_battery = null;
        this.current_battery = null;
        this.battery_remaining = null;
        this.time_unix_usec = null;
        this.time_boot_ms = null;
        this.lat = null;
        this.lon = null;
        this.alt = null;
        this.relative_alt = null;
        this.vx = null;
        this.vy = null;
        this.vz = null;
        this.hdg = null;
        this.airspeed = null;
        this.groundspeed = null;
        this.heading = null;
        this.throttle = null;
        this.climb = null;
    }

    // we can just use code in js like xyzvariable = m_webdrone_object.lat for example to get the lat
    // we can use m_webdrone_object.lat = 32.777 for example to set the lat
}

class Drone { // Cloudstation 2.0
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
        this.other_fields={};
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

    // Other fields
    getOtherFields() {
        return this.other_fields;
    }

    // change which properties are in other_fields
    updateOtherFieldsKeys(fields){
        this.other_fields = {}
        for (const [category, fieldList] of Object.entries(fields)) {
            if (!this.other_fields.hasOwnProperty(category)) {
                this.other_fields[category] = {}
            }
            for (let field of fieldList) {
                this.other_fields[category][field] = null;
            }
        }
    }

    // update other_fields (data is a MAVLink message object), discard extra data
    updateOtherFieldsData(data) {
        let category = data["mavpackettype"]
        for (const [key, value] of Object.entries(data)) {
            if (this.other_fields.hasOwnProperty(category) && this.other_fields[category].hasOwnProperty(key)) {
                this.other_fields[category][key] = value;
            }
        }
    }
}


