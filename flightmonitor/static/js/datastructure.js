class Information{
    constructor(droneID) {
        this.droneID = droneID;
        this.longitude = null;
        this.latitude = null;
        this.yaw = null;
        this.pitch = null;
        this.roll = null;
        this.speed = null;
        this.distance = null;
        this.marker = null;
        this.popup = null;
    }
    // Longitude
    getLong(){
        return this.longitude;
    }
    updateLong(long){
        if (this.longitude == null){
            this.longitude = long;
        }
        else{
            var diff = Math.abs(long - this.longitude);
            if(diff <= 1){
                this.longitude = long;
            }
            else{
                console.log("long move too fast");
            }
        }
    }

    // Latitude
    getLat(){
        return this.latitude;
    }
    updateLat(lat){
        if (this.latitude == null){
            this.latitude = lat;
        }
        else{
            var diff = Math.abs(lat - this.latitude);
            if (diff <= 1){
                this.latitude = lat;
            }
            else{
                console.log("lat move too fast");
            }
        }
    }

    // yaw
    getYaw(){
        return this.yaw;
    }
    updateYaw(yaw){
        this.yaw = yaw;
    }

    // pitch
    getPitch(){
        return this.pitch;
    }
    updatePitch(pitch){
        this.pitch = pitch;
    }

    // roll
    getRoll(){
        return this.roll;
    }
    updateRoll(roll){
        this.roll = roll;
    }

    //speed
    getSpeed(){
        return this.speed;
    }
    updateSpeed(speed){
        this.speed = speed;
    }

    //distance
    getDistance(){
        return this.distance;
    }
    updateDistance(distance){
        this.distance = distance;
    }

    //marker
    getMarker(){
        return this.marker;
    }
    createMarker(marker){
        this.marker = marker;
    }

    //popup
    getPopup(){
        return this.popup;
    }
    createPopup(pop){
        this.popup = pop;
    }



}