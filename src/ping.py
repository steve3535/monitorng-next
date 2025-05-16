import ipaddress
import subprocess
from datetime import datetime, timezone

import time
import re
import requests
import threading



# Paramètres
network_ranges = [
    
    '192.168.4.0/23',

    '10.10.5.0/26'
]


ping_attempts = 3
pause_between_subnets = 5     # secondes entre chaque sous-réseau
pause_between_cycles = 5     # secondes entre chaque cycle complet

API_URL = "https://monitor.linkafric.com/api/metrics"  
API_KEY = "P@ssNtc202!"
def get_all_ips(network):
    return [str(ip) for ip in ipaddress.IPv4Network(network) if not ip.is_multicast]

def ping_ip(ip):
    results = []
    latencies = []
    for _ in range(ping_attempts):
        result = subprocess.run(['ping', '-c', '1', '-W', '1', ip], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
        if result.returncode == 0:
            results.append(True)
            match = re.search(r'time=([\d.]+) ms', result.stdout)
            if match:
                latencies.append(float(match.group(1)))
        else:
            results.append(False)
        time.sleep(0.5)
    return results, latencies

def analyze_results(results, latencies):
    if all(results):
        status = 'CONFIRMED UP'
    elif not any(results):
        status = 'CONFIRMED DOWN'
    else:
        status = 'FLAPPING'
    
    response_time = round(sum(latencies) / len(latencies), 2) if latencies else None
    return status, response_time

def send_to_api(ip, status, response_time):
    data = {
       
        "device_id": ip,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "response_time": str(response_time if response_time is not None else 0.0),
        "status": status.split()[-1]  # UP / DOWN / FLAPPING
    }

    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }


    if API_KEY:
        headers["Authorization"] = f"Bearer {API_KEY}"

    try:
        response = requests.post(API_URL, json=data, headers=headers, timeout=5)
        if response.status_code in (200, 201):
            print(f"  → Données envoyées à l'API avec succès pour {ip}")
        else:
            print(f"  → Échec API {ip} | Code: {response.status_code} | Réponse: {response.text}")
    except Exception as e:
        print(f"  → Erreur d'envoi API pour {ip}: {e}")

def scan_and_send(network):
    all_ips = get_all_ips(network)
    
    for ip in all_ips:
        print(f"Pinging {ip}...")
        ping_results, latencies = ping_ip(ip)
        status, avg_latency = analyze_results(ping_results, latencies)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"  → {status} (Avg latency: {avg_latency if avg_latency is not None else 'N/A'} ms)")
        
        # Envoi immédiat à l'API
        send_to_api(ip, status, avg_latency)


def threaded_scan(network):
    print(f"\n[THREAD] Démarrage scan {network}")
    scan_and_send(network)
    print(f"[THREAD] Fin scan {network}")

if __name__ == "__main__":
    while True:
        print("\n=== Nouveau cycle complet ===")
        threads = []

        for network in network_ranges:
            t = threading.Thread(target=threaded_scan, args=(network,))
            t.start()
            threads.append(t)
            time.sleep(pause_between_subnets)  # petit décalage entre threads

        for t in threads:
            t.join()

        print(f"\nCycle terminé. Pause de {pause_between_cycles} secondes avant redémarrage...")
        time.sleep(pause_between_cycles)
