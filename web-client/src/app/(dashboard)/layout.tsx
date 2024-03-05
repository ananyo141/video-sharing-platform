import LeftNavbar from "@/components/navbars/LeftNavbar";
import TopNavBar from "@/components/navbars/TopNavBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="overflow-hidden">
      <TopNavBar />
      <div className="flex flex-col-reverse md:flex-row" style={{height: "calc(100vh - 3.5rem)"}}>
        <LeftNavbar />
        <div className="p-2 h-screen flex-1 overflow-y-scroll">{children}</div>
      </div>
    </main>
  );
}
