import { useState, useEffect } from "react";

import MainContent from "../../components/homepage/MainContent";
import Sidebar from "@/app/layouts/Sidebar";
import { NavBar } from "@/app/layouts/Navbar";
import { RightBar } from "@/app/layouts/Rightbar";
import FileUploadModal from "@/components/homepage/AddRecordModal";

import { useAuth } from "../../context/AuthContext";

export default function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Logged in User: ", user);
  }, [user]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar onClick={() => setShowModal(true)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <NavBar />

        {showModal && user && <FileUploadModal onClose={() => setShowModal(false)} user={user} />}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <MainContent />
        </div>

        {/* Right Details Panel (Optional) */}
        {/* <RightBar /> */}
      </div>
    </div>
  );
}
