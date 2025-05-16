import React, { useState, useEffect } from "react";
import AddExpense from "./AddExpense";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import EditExpense from "./EditExpense";

const Expense = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [expense, setExpense] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExpense, setFilteredExpense] = useState([]);

  const fetchExpense = async () => {
    try {
      const response = await axiosClient.get(`/expense/user/${userId}`);
      setExpense(response.data);
      setFilteredExpense(response.data);
    } catch (error) {
      console.error(
        "Fetch Expense Error:",
        error.response?.data || error.message,
      );
      toast.error("Failed to fetch Expenses");
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [userId]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const handleModalOpenClick = () => {
    setOpenModal(true);
  };

  const handleEditModalOpenClick = (expenseId) => {
    console.log("Edit button clicked for Expense ID:", expenseId);
    setSelectedExpenseId(expenseId);
    setOpenEditModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setOpenEditModal(false);
    setSelectedExpenseId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = expense.filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      const expenseYear = expenseDate.getFullYear();
      const expenseMonth = expenseDate.getMonth();

      return (
        expenseYear === currentYear &&
        expenseMonth === currentMonth &&
        expense.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredExpense(filtered);
  }, [searchQuery, expense]);

  const handleDelete = async (id) => {
    console.log("Delete button clicked for Expense ID:", id);
    const token = localStorage.getItem("token");
    console.log("Token:", token);

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
        await axiosClient.delete(`/expense/${id}`);
        toast.success("Expense deleted successfully");
        fetchExpense();
      } catch (error) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(
          `Failed to delete expense: ${error.response?.data.message || error.message}`,
        );
      }
    }
  };

  const totalExpense = expense.reduce(
    (sum, item) => sum + (item.amount || 0),
    0,
  );

  return (
    <div className="bg-white p-3 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
        <div className="text-[18px] font-semibold">Expense</div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search expense"
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
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="my-6 sm:my-10">
        <div className="h-auto w-full sm:w-[250px] rounded-lg border-2 border-gray-300 p-4 bg-white shadow-sm">
          <div className="font-extrabold uppercase text-lg sm:text-xl">
            Rs.{totalExpense.toFixed(2)}
          </div>
          <div className="text-[13px] sm:text-[14px] font-bold uppercase text-gray-600">
            Total Expense
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="relative mt-6 sm:mt-10 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
                Category
              </th>
              <th scope="col" className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-extrabold uppercase text-gray-700">
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
            {filteredExpense.length > 0 ? (
              filteredExpense.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                    {item.budgetName}
                    {/* Mobile-only info */}
                    <div className="sm:hidden text-xs text-gray-500 mt-1">
                      <div>{item.title}</div>
                      <div className="mt-1">{item.description}</div>
                      <div className="mt-1">{new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm text-gray-900">
                    {item.title}
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
                <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">
                  No expenses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddExpense
        isOpen={openModal}
        onClose={handleModalClose}
        fetchExpense={fetchExpense}
      />
      {openEditModal && (
        <EditExpense
          isOpen={openEditModal}
          onClose={handleModalClose}
          fetchExpense={fetchExpense}
          selectedExpenseId={selectedExpenseId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Expense;
