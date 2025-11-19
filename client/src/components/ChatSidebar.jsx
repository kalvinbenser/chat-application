import { useEffect, useState } from "react";
import { useMessageStore } from "../store/messageStore";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";
import { Circle, CircleUser } from "lucide-react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function ChatSidebar() {
  const setSelectedUser = useMessageStore((s) => s.setSelectedUser);
  const { selectedUser } = useMessageStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/user/list");
    setUsers(res.data.data);
  };

  const handleLogout = () => {
    setOpenModal(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="text-md font-semibold">{user?.name}</p>
        </div>

        <CircleUser
          size={28}
          className="cursor-pointer hover:text-blue-600 transition"
          onClick={() => setOpenModal(true)}
        />
      </div>

      {/* User List */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {users.map((u) => {
          return (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
       hover:bg-blue-50 transition border border-transparent
       hover:border-blue-200 ${
         u._id === selectedUser?._id ? "bg-blue-50 text-white" : ""
       }`}
            >
              {/* Avatar Circle */}
              <div
                className={`p-2 flex items-center justify-center rounded text-black font-bold border-2 border-black`}
              >
                {u.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* User Details */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Your Profile</ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleLogout} color="red">Logout</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
