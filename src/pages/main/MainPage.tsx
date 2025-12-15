import MainContent from "../../components/homepage/MainContent";
import Sidebar from "../../app/layouts/Sidebar";

export default function MainPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1">
        <MainContent />
      </main>
    </div>
  );
}
