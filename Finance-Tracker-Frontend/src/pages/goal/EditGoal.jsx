import React, { useState, useEffect, useRef } from "react";
import { CloseIcon, StartIcon, StopIcon } from "../../utils/icons";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditGoal = ({ isOpen, onClose, fetchGoal, selectedGoalId }) => {
  const [editedGoal, setEditedGoal] = useState({
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
    if (selectedGoalId && isOpen) {
      axiosClient
        .get(`/goal/${selectedGoalId}`)
        .then((res) => {
          setEditedGoal({
            title: res.data.title || "",
            description: res.data.description || "",
            amount: res.data.amount || "",
          });
        })
        .catch((err) => {
          console.error("Fetch Goal Error:", err.response?.data || err.message);
          toast.error("Failed to load goal details");
        });
    }
  }, [selectedGoalId, isOpen]);

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
        setEditedGoal((prev) => ({ ...prev, [field]: transcript }));
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
    setEditedGoal((prev) => ({
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

    // Validate Goal Title
    if (!editedGoal.title.trim()) {
      newErrors.title = "Goal Title is required";
    } else if (editedGoal.title.trim().length < 3) {
      newErrors.title = "Goal Title must be at least 3 characters long";
    } else if (/^[^a-zA-Z]/.test(editedGoal.title.trim())) {
      newErrors.title = "Goal Title must not start with a number or special character";
    }

    // Validate Description
    if (!editedGoal.description.trim()) {
      newErrors.description = "Description is required";
    } else if (editedGoal.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long";
    }

    // Validate Amount
    if (!editedGoal.amount) {
      newErrors.amount = "Amount is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(editedGoal.amount)) {
      newErrors.amount = "Enter a valid amount";
    } else if (Number(editedGoal.amount) <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axiosClient.put(`/goal/${selectedGoalId}`, editedGoal, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      toast.success("Goal updated successfully");
      fetchGoal();
      handleClose();
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      toast.error(`Failed to update goal: ${error.response?.data.message || error.message}`);
    }
  };

  const handleClose = () => {
    setEditedGoal({ title: "", description: "", amount: "" });
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
              Edit Goal
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
              Goal Title:
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                name="title"
                value={editedGoal.title}
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
                value={editedGoal.description}
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
                value={editedGoal.amount}
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
            Update Goal
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default EditGoal;