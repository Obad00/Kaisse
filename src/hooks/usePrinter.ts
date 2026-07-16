import { useCallback, useState } from "react";
import {
  connectPrinter,
  disconnectPrinter,
  getConnectedPrinterName,
  isBluetoothSupported,
  printBytes,
  type PrinterStatus,
} from "@/printing/bluetoothPrinter";
import { buildReceiptBytes } from "@/printing/receiptFormatter";
import type { Order, Restaurant } from "@/services/types";

export function usePrinter() {
  const [status, setStatus] = useState<PrinterStatus>(
    isBluetoothSupported() ? "disconnected" : "unsupported"
  );
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    try {
      const printer = await connectPrinter();
      setDeviceName(printer.device.name ?? "Imprimante");
      setStatus("connected");
    } catch (err) {
      setStatus("disconnected");
      setError(err instanceof Error ? err.message : "Connexion impossible");
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectPrinter();
    setDeviceName(null);
    setStatus("disconnected");
  }, []);

  const print = useCallback(
    async (order: Order, restaurant: Restaurant) => {
      if (status !== "connected") {
        throw new Error("Imprimante non connectee");
      }
      const bytes = buildReceiptBytes(order, restaurant);
      await printBytes(bytes);
    },
    [status]
  );

  return {
    status,
    deviceName: deviceName ?? getConnectedPrinterName(),
    error,
    connect,
    disconnect,
    print,
    isSupported: status !== "unsupported",
  };
}
