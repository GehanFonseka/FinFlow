import React, { useState, useEffect } from "react";
import AddBudget from "./AddBudget";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditBudget from "./EditBudget";

const Budget = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [budget, setBudget] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBudget, setFilteredBudget] = useState([]);

  const fetchBudget = async () => {
    try {
      const response = await axiosClient.get(`/budget/user/${userId}`);
      setBudget(response.data);
      setFilteredBudget(response.data);
    } catch (error) {
      toast.error("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [userId]);

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (budgetId) => {
    setOpenEditModal(true);
    setSelectedBudgetId(budgetId);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = budget.filter((budget) => {
      const matchesSearch = budget.budgetName
        ? budget.budgetName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesSearch;
    });

    setFilteredBudget(filtered);
  }, [searchQuery, budget]);

  const handleDelete = async (id) => {
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
        await axiosClient.delete(`/budget/${id}`);
        toast.success("Budget deleted successfully");
        fetchBudget();
      } catch (error) {
        toast.error("Failed to delete budget");
      }
    }
  };

  const totalBudget = budget.reduce((sum, item) => sum + item.price, 0);
  const totalUsedAmount = budget.reduce((sum, item) => sum + item.usedAmount, 0);
  const totalRemainingAmount = budget.reduce(
    (sum, item) => sum + (item.price - item.usedAmount),
    0
  );

  return (
    <div className="bg-white p-3 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
        <div className="text-[18px] font-semibold">Budget</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search budget"
              name="searchQueryName"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full sm:w-auto rounded-lg border-2 border-gray-500 p-2 text-[14px] focus:border-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div>
            <button
              onClick={() => handleModalOpenClick()}
              className="w-full sm:w-auto rounded-full bg-[#25C935] px-4 py-2 text-[15px] font-medium text-white hover:bg-[#1ea32b] transition-colors"
            >
              Add Budget
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="my-6 sm:my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
        <div className="h-auto w-full rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs.{totalBudget.toFixed(2)}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total Budget
          </div>
        </div>

        <div className="h-auto w-full rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs.{totalUsedAmount.toFixed(2)}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total Used
          </div>
        </div>

        <div className="h-auto w-full rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs.{totalRemainingAmount.toFixed(2)}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total Left
          </div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="relative mt-6 sm:mt-10 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 text-xs font-extrabold uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Budget
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Used
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Left
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBudget.length > 0 ? (
              filteredBudget.map((item) => {
                const usedPercentage = (item.usedAmount / item.price) * 100;
                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 bg-white text-gray-900"
                  >
                    <th
                      scope="row"
                      className="px-4 sm:px-6 py-4 font-medium"
                    >
                      {item.budgetName}
                    </th>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="whitespace-nowrap">
                        Rs. {item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="whitespace-nowrap">
                        Rs. {item.usedAmount.toFixed(2)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mt-2">
                        <div
                          className={`h-full rounded-full ${
                            usedPercentage > 100
                              ? "bg-red-600"
                              : "bg-[#25C935]"
                          }`}
                          style={{
                            width: `${Math.min(usedPercentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-[#25C935]">
                      <span className="whitespace-nowrap">
                        Rs. {(item.price - item.usedAmount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                          onClick={() => handleEditModalOpenClick(item._id)}
                          className="rounded-md bg-black px-2 py-1 font-medium text-white hover:bg-gray-800 transition-colors text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-md bg-red-600 px-2 py-1 font-medium text-white hover:bg-red-700 transition-colors text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 sm:px-6 py-4 text-center text-gray-500"
                >
                  No budgets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddBudget
        isOpen={openModal}
        onClose={handleModalClose}
        fetchBudget={fetchBudget}
      />
      <EditBudget
        isOpen={openEditModal}
        onClose={handleModalClose}
        fetchBudget={fetchBudget}
        selectedBudgetId={selectedBudgetId}
      />
      <ToastContainer />
    </div>
  );
};

export default Budget;
