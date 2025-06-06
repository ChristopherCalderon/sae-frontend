
import SysNavbar from "@/components/navigation/SysNavbar";
import "../../app/globals.css";

export const metadata = {
  title: "AssessCode",
  description: "",
}; //

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen lg:min-h-screen lg:max-h-screen w-full">
      <SysNavbar />
      <main className="lg:w-[91%] w-full h-full mt-6 lg:mt-0">{children}</main>
    </div>
  );
}
