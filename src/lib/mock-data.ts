import { Device } from '../types/device'
import { Metrics } from '../types/metrics'
import { Alert } from '../types/alert'

export const devices: Device[] = [
  {
    id: 'gab-123',
    name: 'GAB Zanguera',
    type: 'GAB',
    ip_address: '10.10.5.53',
    location: 'Zanguera',
    region: 'Maritime',
    coordinates: [6.1629, 1.1486],
    status: 'up',
    last_ping: '2025-05-10T07:30:02Z',
    response_time: 34,
    uptime_24h: 99.7
  },
  {
    id: 'tpe-001',
    name: 'TPE Lomé Centre',
    type: 'TPE',
    ip_address: '10.10.6.12',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.1319, 1.2228],
    status: 'down',
    last_ping: '2025-05-10T07:28:00Z',
    response_time: null,
    uptime_24h: 95.2
  },
  {
    id: 'tpe-002',
    name: 'CHAMPION ADIDOGOME',
    type: 'TPE',
    ip_address: '192.168.4.130',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.17788, 1.1756],
    status: 'up',
    last_ping: '2025-05-10T07:32:00Z',
    response_time: 40,
    uptime_24h: 98.5
  },
  {
    id: 'tpe-003',
    name: 'SADIV TOGO SARL',
    type: 'TPE',
    ip_address: '10.10.7.18',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'down',
    last_ping: '2025-05-10T07:31:00Z',
    response_time: null,
    uptime_24h: 92.1
  },
  {
    id: 'tpe-004',
    name: 'BIOAFRICA CORPORATION',
    type: 'TPE',
    ip_address: '10.10.6.163',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:30:00Z',
    response_time: 37,
    uptime_24h: 97.3
  },
  {
    id: 'tpe-005',
    name: 'DORSI SARL',
    type: 'TPE',
    ip_address: '10.10.6.224',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:29:00Z',
    response_time: 35,
    uptime_24h: 99.1
  },
  {
    id: 'tpe-006',
    name: 'ESTHETICA 2000',
    type: 'TPE',
    ip_address: '10.10.6.219',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'flapping',
    last_ping: '2025-05-10T07:28:00Z',
    response_time: 50,
    uptime_24h: 93.7
  },
  {
    id: 'tpe-007',
    name: 'PHARMACIE NOTRE DAME',
    type: 'TPE',
    ip_address: '10.10.6.189',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:27:00Z',
    response_time: 32,
    uptime_24h: 97.9
  },
  {
    id: 'tpe-008',
    name: 'SIDE TRAVEL & TOURS',
    type: 'TPE',
    ip_address: '192.168.5.77',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'down',
    last_ping: '2025-05-10T07:26:00Z',
    response_time: null,
    uptime_24h: 91.4
  },
  {
    id: 'tpe-009',
    name: 'PHARMACIE MICHELLE',
    type: 'TPE',
    ip_address: '10.10.6.121',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:25:00Z',
    response_time: 38,
    uptime_24h: 96.8
  },
  {
    id: 'tpe-010',
    name: 'PHARMACIE AGOE NYIVE',
    type: 'TPE',
    ip_address: '192.168.4.182',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.22612, 1.21107],
    status: 'up',
    last_ping: '2025-05-10T07:24:00Z',
    response_time: 36,
    uptime_24h: 98.2
  },
  {
    id: 'tpe-011',
    name: 'CCT BATIMAT QUINCAILLERIE',
    type: 'TPE',
    ip_address: '10.10.6.89',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'flapping',
    last_ping: '2025-05-10T07:23:00Z',
    response_time: 45,
    uptime_24h: 94.5
  },
  {
    id: 'tpe-012',
    name: 'APELF',
    type: 'TPE',
    ip_address: '192.168.5.2',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:22:00Z',
    response_time: 33,
    uptime_24h: 99.0
  },
  {
    id: 'tpe-013',
    name: 'SUPERAMCO ADIDOADE 2',
    type: 'TPE',
    ip_address: '10.10.7.99',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'down',
    last_ping: '2025-05-10T07:21:00Z',
    response_time: null,
    uptime_24h: 90.7
  },
  {
    id: 'tpe-014',
    name: 'VLISCO AFRICAN(VLISCO)',
    type: 'TPE',
    ip_address: '10.10.6.124',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:20:00Z',
    response_time: 39,
    uptime_24h: 97.5
  },
  {
    id: 'tpe-015',
    name: 'LE PATIO 1',
    type: 'TPE',
    ip_address: '192.168.4.154',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.1375, 1.2123],
    status: 'up',
    last_ping: '2025-05-10T07:19:00Z',
    response_time: 31,
    uptime_24h: 98.8
  },
  {
    id: 'tpe-016',
    name: 'EUROPCAR',
    type: 'TPE',
    ip_address: '10.10.6.69',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13663, 1.257155],
    status: 'flapping',
    last_ping: '2025-05-10T07:18:00Z',
    response_time: 48,
    uptime_24h: 93.2
  },
  {
    id: 'tpe-017',
    name: 'SOTIMEX1',
    type: 'TPE',
    ip_address: '10.10.6.41',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:17:00Z',
    response_time: 35,
    uptime_24h: 97.1
  },
  {
    id: 'tpe-018',
    name: 'PHARMACIE DE LA MAIRIE',
    type: 'TPE',
    ip_address: '10.10.7.59',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'down',
    last_ping: '2025-05-10T07:16:00Z',
    response_time: null,
    uptime_24h: 91.9
  },
  {
    id: 'tpe-019',
    name: 'UNIVERS SANTE',
    type: 'TPE',
    ip_address: '10.10.6.126',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:15:00Z',
    response_time: 36,
    uptime_24h: 98.0
  },
  {
    id: 'tpe-020',
    name: 'SUPERAMCO CAISSE RESIDENCE',
    type: 'TPE',
    ip_address: '192.168.4.98',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.17029, 1.22745],
    status: 'up',
    last_ping: '2025-05-10T07:14:00Z',
    response_time: 34,
    uptime_24h: 99.2
  },
  {
    id: 'tpe-021',
    name: 'SOTIMEX2',
    type: 'TPE',
    ip_address: '10.10.6.58',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'flapping',
    last_ping: '2025-05-10T07:13:00Z',
    response_time: 47,
    uptime_24h: 94.1
  },
  {
    id: 'tpe-022',
    name: "PHARMACIE DE L'AEROPORT",
    type: 'TPE',
    ip_address: '192.168.5.201',
    location: 'Lomé',
    region: 'Maritime',
    coordinates: [6.13, 1.21],
    status: 'up',
    last_ping: '2025-05-10T07:12:00Z',
    response_time: 33,
    uptime_24h: 98.7
  }
]

export const metrics: Metrics[] = [
  {
    device_id: 'gab-123',
    timestamps: [
      '2025-05-10T07:00:00Z',
      '2025-05-10T07:05:00Z',
      '2025-05-10T07:10:00Z',
      '2025-05-10T07:15:00Z',
      '2025-05-10T07:20:00Z',
      '2025-05-10T07:25:00Z',
      '2025-05-10T07:30:00Z'
    ],
    response_times: [34, 37, 36, null, 35, 34, 33],
    statuses: ['up', 'up', 'up', 'down', 'up', 'up', 'up']
  }
]

export const alerts: Alert[] = [
  {
    id: 'alert-456',
    device_id: 'gab-123',
    type: 'down',
    severity: 'high',
    message: 'GAB Zanguera is down for 5 minutes',
    triggered_at: '2025-05-10T07:25:00Z',
    resolved_at: null,
    acknowledged: false
  }
] 