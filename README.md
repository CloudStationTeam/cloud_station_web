# Web-based Ground Control Station
[![LICENSE](https://img.shields.io/badge/license-GPL--3.0-brightgreen)](https://github.com/lyuyangh/cloud-station/blob/master/LICENSE)
## Our website
A deployed [CloudStation](http://ec2-52-52-195-170.us-west-1.compute.amazonaws.com/)
## Prerequisite 
```
Python 3.6+
Django
Django Channels
Django Background Tasks
Redis
pyMavlink
pyserial
Docker
```
> Tutorial to setup Python Django development environment: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment

## Getting started
  1. Install libraries    
      ```
      pip3 install django   
      pip3 install channels_redis
      pip3 install django-background-tasks
      pip3 install pymavlink
      pip3 install pyserial
      git clone https://github.com/lyuyangh/cloud-station.git   
      ```
  2. Install and run docker: https://www.docker.com/get-started
      ```  
      docker run -p 6379:6379 -d redis:2.8
      ```
  3. Register for MapBox and generate a public access token https://account.mapbox.com/
  4. Add mapbox public access token (public key) to .env of your environment
    Note: Please do not push your pk to GitHub. In production env, this key should ideally
    be temporary and change from session to session.      
        * ubuntu   
        ```export MAPBOX_PUBLIC_KEY=pk.xxxxxxxxxxxxxxxxxxxxxxxxxx```     
        * windows  
        ```setx MAPBOX_PUBLIC_KEY "pk.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"``` or add an entry in system variables
        
### Run server
```
python3 manage.py runserver
```
## Architecture
## Milestones
- [x] System architecture and prototype (8/31/19)
- [x] Rewrite mavlink streaming code (9/5/19)
- [x] Add map to html (10/15/19)
- [x] Deploy on AWS (10/15/19) We are online!!!
- [x] Build hardware stack with Omnibus F4 and Raspberry Pi (10/30/19)
- [x] Two way communication between vehicle and the server (11/5/19)
- [ ] User authentication (IP)
- [ ] Mark drone location on map (IP)
- [ ] Migrate to AWS RDS
- [ ] Communicate with multiple drones at the same time
## Authors
  * Lyuyang Hu - Software architecture design, prototyping, project management, backend development
  * 
  * 
  * 
  * 
  * 
## Advisor
  * Professor Peter Burke
## License
GNU General Public License v3.0
