# Web-based Ground Control Station

## Prerequisite 
```
Python 3.6+
Django
Django Channels
Django Background Tasks
Redis
Docker
```
> Tutorial to setup Python Django development environment: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment

## Getting started
  1. Install libraries 
    ```bash
    pip3 install django
    pip3 install -U channels
    pip3 install django-background-tasks
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
    - Ubuntu
        ```bash
        export MAPBOX_PUBLIC_KEY=pk.xxxxxxxxxxxxxxxxxxxxxxxxxx
        ```
    - Windows
        ```
        setx MAPBOX_PUBLIC_KEY "pk.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        ```
        or add an entry in system variables
### Run server
```python
python3 manage.py runserver
```
## Architecture
## To Do
- [x] Rewrite mavlink streaming code
- [ ] Add map to html
- [ ] Deploy on AWS
- [ ] Mark drone location on map
## Authors
## License