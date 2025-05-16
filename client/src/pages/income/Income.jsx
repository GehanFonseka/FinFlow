import React, { useState, useEffect } from "react";
import AddIncome from "./AddIncome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditIncome from "./EditIncome";

const Income = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [income, setIncome] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIncome, setFilteredIncome] = useState([]);

  const fetchIncome = async () => {
    try {
      const response = await axiosClient.get(`/income/user/${userId}`);
      setIncome(response.data);
      setFilteredIncome(response.data);
    } catch (error) {
      console.error("Fetch Income Error:", error.response?.data || error.message);
      toast.error("Failed to fetch incomes");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [userId]);

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (incomeId) => {
    console.log("Edit button clicked for Income ID:", incomeId);
    setSelectedIncomeId(incomeId);
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
    setSelectedIncomeId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const filtered = income.filter((income) => {
      const incomeDate = new Date(income.createdAt);
      const incomeYear = incomeDate.getFullYear();
      const incomeMonth = incomeDate.getMonth();

      return (
        incomeYear === currentYear &&
        incomeMonth === currentMonth &&
        income.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredIncome(filtered);
  }, [searchQuery, income]);

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
        await axiosClient.delete(`/income/${id}`);
        toast.success("Income deleted successfully");
        fetchIncome();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(`Failed to delete income: ${error.response?.data.message || error.message}`);
      }
    }
  };

  const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-white p-3 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
        <div className="text-[18px] font-semibold">Income</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search income"
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
              Add Income
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="my-6 sm:my-10">
        <div className="h-auto w-full sm:w-[250px] rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs.{totalIncome.toFixed(2)}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total Income
          </div>
        </div>
      </div>

      {/* Income Table */}
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
                Date
              </th>
              <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-extrabold uppercase text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredIncome.length > 0 ? (
              filteredIncome.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                    {item.title}
                    {/* Mobile-only description and date */}
                    <div className="sm:hidden text-xs text-gray-500 mt-1">
                      {item.description}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-500">
                    {item.description}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    Rs. {item.amount?.toFixed(2)}
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex flex-row justify-end gap-2">
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">
                  No incomes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddIncome
        isOpen={openModal}
        onClose={handleModalClose}
        fetchIncome={fetchIncome}
      />
      {openEditModal && (
        <EditIncome
          isOpen={openEditModal}
          onClose={handleModalClose}
          fetchIncome={fetchIncome}
          selectedIncomeId={selectedIncomeId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Income;