import { Bluetooth, BluetoothConnected, BluetoothOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { PrinterStatus } from "@/printing/bluetoothPrinter";

interface PrinterStatusBadgeProps {
  status: PrinterStatus;
  deviceName?: string | null;
}

export function PrinterStatusBadge({ status, deviceName }: PrinterStatusBadgeProps) {
  if (status === "unsupported") {
    return (
      <Badge tone="neutral">
        <BluetoothOff size={13} />
        Bluetooth indisponible
      </Badge>
    );
  }
  if (status === "connected") {
    return (
      <Badge tone="success">
        <BluetoothConnected size={13} />
        {deviceName ?? "Imprimante connectee"}
      </Badge>
    );
  }
  if (status === "connecting") {
    return (
      <Badge tone="warn">
        <Bluetooth size={13} />
        Connexion...
      </Badge>
    );
  }
  return (
    <Badge tone="neutral">
      <BluetoothOff size={13} />
      Imprimante non connectee
    </Badge>
  );
}
