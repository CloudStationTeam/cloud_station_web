import subprocess

def get_service_status(service_name:str)->str:
    """ get service status of nginx, daphne, backgroundtasks and docker"""
    return subprocess.run(["service", service_name], stdout=subprocess.PIPE, text=True, check=True)

def get_udp_dump_at_port(port_num:int)->str:
    return subprocess.run(["sudo", "tcpdump", "-n", "udp", "port", str(port_num), "-X"], stdout=subprocess.PIPE, text=True, check=True)

def get_all_docker_container_status()->str:
    return subprocess.run(["sudo", "docker", "ps", "-a"], stdout=subprocess.PIPE, text=True, check=True)

def restart_docker()->str:
    results = []
    results.append(subprocess.run(["sudo", "systemctl", "start", "docker"],stdout=subprocess.PIPE, text=True, check=True))
    results.append(subprocess.run(["sudo", "systemctl", "enable", "docker"], stdout=subprocess.PIPE, text=True, check=True))
    results.append(subprocess.run(["sudo", "docker", "run", "-p", "6379:6379", "-d", "redis:7.2.3"], stdout=subprocess.PIPE, text=True, check=True))
    return results