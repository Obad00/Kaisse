// Minimal Web Bluetooth API typings — TypeScript's default DOM lib does not
// ship these yet. Only what Kaisse actually uses is declared here.

interface BluetoothRemoteGATTCharacteristic {
  writeValue(value: Uint8Array): Promise<void>;
  writeValueWithoutResponse?(value: Uint8Array): Promise<void>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothDevice extends EventTarget {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface RequestDeviceOptions {
  filters?: Array<{ services?: string[]; namePrefix?: string }>;
  optionalServices?: string[];
  acceptAllDevices?: boolean;
}

interface Bluetooth {
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
  getAvailability(): Promise<boolean>;
}

interface Navigator {
  bluetooth?: Bluetooth;
}
