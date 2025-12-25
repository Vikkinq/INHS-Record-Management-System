type HelpModalProps = {
  onClose: () => void;
};

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Help & User Guide</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <section>
            <h3 className="font-semibold mb-1">System Overview</h3>
            <p>
              This system manages student records securely and allows authorized users to upload, view, and maintain
              documents.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">User Roles</h3>
            <ul className="list-disc ml-5">
              <li>
                <b>Admin</b> – Manage users and records
              </li>
              <li>
                <b>Staff</b> – Upload and view records
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-1">Basic Usage</h3>
            <ul className="list-disc ml-5">
              <li>Use the sidebar to add or view records</li>
              <li>Select a file to view details</li>
              <li>Admins can update or delete records</li>
            </ul>
          </section>

          <section className="text-xs text-gray-500 pt-2 border-t">
            For technical concerns, contact the system administrator.
          </section>
        </div>
      </div>
    </div>
  );
}
