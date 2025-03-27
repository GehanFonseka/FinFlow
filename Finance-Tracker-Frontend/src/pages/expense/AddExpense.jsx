import React, { useState, useEffect, useRef } from "react";
import { CloseIcon, StartIcon, StopIcon } from "../../utils/icons";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddExpense = ({ isOpen, onClose, fetchExpense }) => {
  const { user } = useStateContext();
  const userId = user.id;
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    budgetId: "",
    userId: userId,
  });
  const [isListening, setIsListening] = useState({
    title: false,
    description: false,
    amount: false,
  });
  const [errors, setErrors] = useState({});
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);

  if (!recognitionRef.current && "webkitSpeechRecognition" in window) {
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
  }

  const startListening = (field) => {
    if (recognitionRef.current && !activeFieldRef.current) {
      activeFieldRef.current = field;
      setIsListening((prev) => ({ ...prev, [field]: true }));
      recognitionRef.current.start();
      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setFormData((prev) => ({ ...prev, [field]: transcript }));
      };
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening(field);
      };
    }
  };

  const stopListening = (field) => {
    if (recognitionRef.current && activeFieldRef.current === field) {
      setIsListening((prev) => ({ ...prev, [field]: false }));
      recognitionRef.current.stop();
      activeFieldRef.current = null;
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await axiosClient.get(`/budget/user/${userId}`);
      setBudget(response.data);
    } catch (error) {
      toast.error("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Expense Title is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }
    if (!formData.budgetId) newErrors.budgetId = "Please select a budget";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axiosClient.post("/expense", formData);
      toast.success("Expense added successfully!");
      setFormData({
        title: "",
        description: "",
        amount: "",
        userId: userId,
        budgetId: "",
      });
      fetchExpense();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      budgetId: "",
      userId: userId,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      size="xs"
      open={isOpen}
      handler={handleClose}
      className="overflow-scroll rounded-[10px] bg-white font-inter shadow-none scrollbar-hide"
    >
      <DialogHeader className="align-center flex justify-between border-b border-[#ececec] pb-3">
        <div className="align-center flex">
          <div>
            <p className="font-poppins text-[18px] font-semibold leading-[28px] text-[#000000]">
              Add New Expense
            </p>
          </div>
        </div>
        <div onClick={handleClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </DialogHeader>
      <DialogBody className="p-5">
        <div className="flex flex-col p-4 text-gray-800">
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Select Budget:
            </label>
            <select
              name="budgetId"
              value={formData.budgetId}
              onChange={handleChange}
              className="w-[80%] rounded border p-2"
            >
              <option value="">-- Select Budget --</option>
              {budget.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.budgetName}
                </option>
              ))}
              <option value="0">Other</option>
            </select>
            {errors.budgetId && (
              <p className="text-sm text-red-500">{errors.budgetId}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Expense Title:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.title ? (
                  <button
                    onClick={() => startListening("title")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("title")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Description:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.description ? (
                  <button
                    onClick={() => startListening("description")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("description")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[15px] font-semibold">
              Amount:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-[80%] rounded border p-2"
              />
              <div>
                {!isListening.amount ? (
                  <button
                    onClick={() => startListening("amount")}
                    className="ml-2 rounded-full bg-blue-500 px-2 py-2 text-white"
                    disabled={activeFieldRef.current}
                  >
                    <StartIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => stopListening("amount")}
                    className="ml-2 rounded-full bg-red-500 px-2 py-2 text-white"
                  >
                    <StopIcon />
                  </button>
                )}
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 w-[130px] rounded-md bg-[#25C935] px-4 py-[6px] text-[15px] font-semibold text-white"
          >
            Add Expense
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default AddExpense;
