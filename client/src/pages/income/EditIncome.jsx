import React, { useState, useEffect, useRef } from "react";
import { CloseIcon, StartIcon, StopIcon } from "../../utils/icons";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditIncome = ({ isOpen, onClose, fetchIncome, selectedIncomeId }) => {
  const [editedIncome, setEditedIncome] = useState({
    title: "",
    description: "",
    amount: "",
  });
  const [isListening, setIsListening] = useState({
    title: false,
    description: false,
    amount: false,
  });
  const [errors, setErrors] = useState({});
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);

  useEffect(() => {
    if (selectedIncomeId && isOpen) {
      axiosClient
        .get(`/income/${selectedIncomeId}`)
        .then((res) => {
          setEditedIncome({
            title: res.data.title || "",
            description: res.data.description || "",
            amount: res.data.amount || "",
          });
        })
        .catch((err) => {
          console.error("Fetch Income Error:", err.response?.data || err.message);
          toast.error("Failed to load income details");
        });
    }
  }, [selectedIncomeId, isOpen]);

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
        setEditedIncome((prev) => ({ ...prev, [field]: transcript }));
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedIncome((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // Validate Income Title
    if (!editedIncome.title.trim()) {
      newErrors.title = "Income Title is required";
    } else if (editedIncome.title.trim().length < 3) {
      newErrors.title = "Income Title must be at least 3 characters long";
    } else if (/^[^a-zA-Z]/.test(editedIncome.title.trim())) {
      newErrors.title = "Income Title must not start with a number or special character";
    }

    // Validate Description
    if (!editedIncome.description.trim()) {
      newErrors.description = "Description is required";
    } else if (editedIncome.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long";
    }

    // Validate Amount
    if (!editedIncome.amount) {
      newErrors.amount = "Amount is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(editedIncome.amount)) {
      newErrors.amount = "Enter a valid amount ";
    } else if (Number(editedIncome.amount) <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axiosClient.put(`/income/${selectedIncomeId}`, editedIncome, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      toast.success("Income updated successfully");
      fetchIncome();
      handleClose();
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      toast.error(`Failed to update income: ${error.response?.data.message || error.message}`);
    }
  };

  const handleClose = () => {
    setEditedIncome({ title: "", description: "", amount: "" });
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
              Edit Income
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
              Income Title:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="title"
                value={editedIncome.title}
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
                value={editedIncome.description}
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
                value={editedIncome.amount}
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
            className="mt-4 w-[150px] rounded-md bg-[#25C935] px-4 py-[6px] text-[15px] font-semibold text-white"
          >
            Update Income
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default EditIncome;