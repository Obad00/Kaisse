import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

// export function POSLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-canvas">
//       <Sidebar />
//       <main className="flex-1 pb-24 lg:pb-0">{children}</main>
//       <BottomNav />
//     </div>
//   );
// }
export function POSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-24 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}