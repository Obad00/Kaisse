// Handles pairing + writing raw ESC/POS bytes to a 58mm Bluetooth thermal
// printer over Web Bluetooth (GATT). Most inexpensive ESC/POS BLE printers
// (Xprinter/GOOJPRT clones commonly sold in Senegal) expose a generic
// serial-like GATT service using the UUIDs below.

const PRINTER_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb";
const PRINTER_CHARACTERISTIC_UUID = "00002af1-0000-1000-8000-00805f9b34fb";

const CHUNK_SIZE = 100; // bytes per GATT write — safe default across devices
const CHUNK_DELAY_MS = 20;

export type PrinterStatus = "unsupported" | "disconnected" | "connecting" | "connected" | "error";

interface ConnectedPrinter {
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

let connected: ConnectedPrinter | null = null;

export function isBluetoothSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}

export function getConnectedPrinterName(): string | null {
  return connected?.device.name ?? null;
}

export async function connectPrinter(): Promise<ConnectedPrinter> {
  if (!navigator.bluetooth) {
    throw new Error("Web Bluetooth non disponible sur cet appareil/navigateur.");
  }

  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [PRINTER_SERVICE_UUID] }],
    optionalServices: [PRINTER_SERVICE_UUID],
  });

  const server = await device.gatt?.connect();
  if (!server) throw new Error("Connexion GATT impossible.");

  const service = await server.getPrimaryService(PRINTER_SERVICE_UUID);
  const characteristic = await service.getCharacteristic(PRINTER_CHARACTERISTIC_UUID);

  connected = { device, characteristic };
  return connected;
}

export function disconnectPrinter() {
  connected?.device.gatt?.disconnect();
  connected = null;
}

function chunk(bytes: Uint8Array, size: number): Uint8Array[] {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += size) {
    chunks.push(bytes.slice(i, i + size));
  }
  return chunks;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function printBytes(bytes: Uint8Array): Promise<void> {
  if (!connected) {
    throw new Error("Aucune imprimante connectee.");
  }
  const { characteristic } = connected;
  for (const part of chunk(bytes, CHUNK_SIZE)) {
    if (characteristic.writeValueWithoutResponse) {
      await characteristic.writeValueWithoutResponse(part);
    } else {
      await characteristic.writeValue(part);
    }
    await wait(CHUNK_DELAY_MS);
  }
}
