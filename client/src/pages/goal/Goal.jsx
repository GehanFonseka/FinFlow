import React, { useState, useEffect } from "react";
import AddGoal from "./AddGoal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditGoal from "./EditGoal";

const Goal = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [goal, setGoal] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGoal, setFilteredGoal] = useState([]);

  const fetchGoal = async () => {
    try {
      const response = await axiosClient.get(`/goal/user/${userId}`);
      setGoal(response.data);
      setFilteredGoal(response.data);
    } catch (error) {
      console.error("Fetch Goal Error:", error.response?.data || error.message);
      toast.error("Failed to fetch Goals");
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await axiosClient.get(`/wallet/user/${userId}`);
      setWallet(response.data[0]);
    } catch (error) {
      console.error("Fetch Goal Error:", error.response?.data || error.message);
      toast.error("Failed to fetch wallet");
    }
  };

  useEffect(() => {
    fetchGoal();
    fetchWallet();
  }, [userId]);

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (goalId) => {
    console.log("Edit button clicked for Goal ID:", goalId);
    setSelectedGoalId(goalId);
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
    setSelectedGoalId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = goal.filter((goal) =>
      goal.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredGoal(filtered);
  }, [searchQuery, goal]);

  const handleDelete = async (id) => {
    console.log("Delete button clicked for Goal ID:", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/goal/${id}`);
        toast.success("Goal deleted successfully");
        fetchGoal();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(
          `Failed to delete goal: ${error.response?.data.message || error.message}`,
        );
      }
    }
  };

  const handleComplete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Complete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.post(`/goal/goal-completed/${id}`);
        toast.success("Congratulations !!! Goal is completed successfully");
        fetchGoal();
        fetchWallet();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(
          `Failed to complete goal: ${error.response?.data.message || error.message}`,
        );
      }
    }
  };

  const totalGoal = goal.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-white p-3 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
        <div className="text-[18px] font-semibold">Goal</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search goal"
              name="searchQueryName"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full sm:w-auto rounded-lg border-2 border-gray-500 p-2 text-[14px] focus:border-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              onClick={() => handleModalOpenClick()}
              className="w-full sm:w-auto rounded-full bg-[#25C935] px-4 py-2 text-[15px] font-medium text-white hover:bg-[#1ea32b] transition-colors"
            >
              Add Goal
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="my-6 sm:my-10 flex flex-col sm:flex-row gap-4 sm:gap-10">
        <div className="h-auto w-full sm:w-[200px] rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs. {wallet?.totalSaving ? Number(wallet?.totalSaving).toFixed(2) : "0.00"}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total savings
          </div>
        </div>
        <div className="h-auto w-full sm:w-[200px] rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs.{totalGoal.toFixed(2)}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total goals amount
          </div>
        </div>
      </div>

      {/* Goals Table */}
      <div className="relative mt-6 sm:mt-10 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                Title
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                Description
              </th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                Amount
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                Remaining
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                Date
              </th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-extrabold uppercase text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGoal.length > 0 ? (
              filteredGoal.map((item) => {
                const percentage = Math.min(
                  (wallet.totalSaving / item.amount) * 100,
                  100,
                ).toFixed(2);
                const remainingAmount = Math.max(
                  item.amount - wallet.totalSaving,
                  0,
                );
                const progressBarColor =
                  percentage == 100 ? "bg-[#25C935]" : "bg-blue-600";
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                      {item.title}
                      {/* Mobile-only info */}
                      <div className="sm:hidden space-y-1 mt-1 text-xs text-gray-500">
                        <div>{item.description}</div>
                        <div>Remaining: Rs. {remainingAmount.toFixed(2)}</div>
                        <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-500">
                      {item.description}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        Rs. {item.amount.toFixed(2)}
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`${progressBarColor} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      Rs. {remainingAmount.toFixed(2)}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => handleEditModalOpenClick(item._id)}
                          className="inline-flex items-center rounded-md bg-black px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center rounded-md bg-red-600 px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Delete
                        </button>
                        {percentage == 100 && (
                          <button
                            onClick={() => handleComplete(item._id)}
                            className="inline-flex items-center rounded-md bg-[#25C935] px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-[#1ea32b] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">
                  No Goals available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddGoal
        isOpen={openModal}
        onClose={handleModalClose}
        fetchGoal={fetchGoal}
      />
      {openEditModal && (
        <EditGoal
          isOpen={openEditModal}
          onClose={handleModalClose}
          fetchGoal={fetchGoal}
          selectedGoalId={selectedGoalId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Goal;
