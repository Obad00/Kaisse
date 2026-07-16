import type { Order, Restaurant } from "@/services/types";
import { EscPosBuilder, twoColumnLine, wrapText } from "./escposEncoder";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";

const RECEIPT_WIDTH = 32; // characters, standard for 58mm paper

export function buildReceiptBytes(order: Order, restaurant: Restaurant): Uint8Array {
  const b = new EscPosBuilder();

  b.init();
  b.align("center");
  b.doubleSize(true);
  b.bold(true);
  b.line(restaurant.name);
  b.doubleSize(false);
  b.bold(false);

  if (restaurant.address) b.line(restaurant.address);
  if (restaurant.phone) b.line(`Tel: ${restaurant.phone}`);

  b.line();
  b.divider("=", RECEIPT_WIDTH);
  b.align("left");
  b.line(formatDateTime(order.createdAt));
  b.line(`Commande #${order.id.slice(-6).toUpperCase()}`);
  b.divider("-", RECEIPT_WIDTH);

  for (const item of order.items) {
    const label = `${item.quantity}x ${item.productName}`;
    const lineTotal = formatCurrency(item.unitPrice * item.quantity);
    const wrapped = wrapText(label, RECEIPT_WIDTH - lineTotal.length - 1);
    wrapped.forEach((chunk, i) => {
      if (i === wrapped.length - 1) {
        b.line(twoColumnLine(chunk, lineTotal, RECEIPT_WIDTH));
      } else {
        b.line(chunk);
      }
    });
  }

  b.divider("-", RECEIPT_WIDTH);
  b.bold(true);
  b.line(twoColumnLine("TOTAL", formatCurrency(order.total), RECEIPT_WIDTH));
  b.bold(false);
  b.divider("=", RECEIPT_WIDTH);

  b.align("center");
  b.line();
  if (restaurant.receiptFooterNote) b.line(restaurant.receiptFooterNote);
  b.line("Kaisse");
  b.feed(4);
  b.cut();

  return b.build();
}
