"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

interface IData {
  email: string;
  step1: string;
  step2: string;
  step3: string;
}

function Settings() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);

  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);

  const [data, setData] = useState<IData | null>(null);

  const { isAdminLoggedIn } = useAppSelector((state) => state.adminAuth);

  // Fetch data
  useEffect(() => {
    axios.get("/api/getData").then((res) => {
      setData(res.data.data);
      setPreview1(res.data.data.step1 || null);
      setPreview2(res.data.data.step2 || null);
      setPreview3(res.data.data.step3 || null);
    });
  }, []);

  // Handle file input
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    step: 1 | 2 | 3
  ) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (step === 1) {
        setImage1(file);
        setPreview1(previewUrl);
      }
      if (step === 2) {
        setImage2(file);
        setPreview2(previewUrl);
      }
      if (step === 3) {
        setImage3(file);
        setPreview3(previewUrl);
      }
    }
  };

  // Upload
  const handleImageUpload = async (step: 1 | 2 | 3, file: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const loading = toast.loading("Updating...");
    try {
      const response = await axios.post(
        `/api/admin/change/step${step}`,
        formData
      );
      console.log(response.data);

      toast.success("Image uploaded successfully", { id: loading });

      // reset selected file
      if (step === 1) setImage1(null);
      if (step === 2) setImage2(null);
      if (step === 3) setImage3(null);

      // set preview from cloudinary after update
      if (response.data?.data?.step1 && step === 1)
        setPreview1(response.data.data.step1);
      if (response.data?.data?.step2 && step === 2)
        setPreview2(response.data.data.step2);
      if (response.data?.data?.step3 && step === 3)
        setPreview3(response.data.data.step3);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data.message || "Upload failed", {
        id: loading,
      });
    }
  };

  // Email update
  const handleEmail = async () => {
    if (!email) return;
    const loading = toast.loading("Updating...");
    try {
      const response = await axios.post("/api/admin/change/email", { email });
      console.log(response.data);
      toast.success("Email updated successfully", { id: loading });
      setEmail("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data.message || "Email update failed", {
        id: loading,
      });
    }
  };

  // Auth guard
  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [isAdminLoggedIn, router]);

  // Render Image Upload UI
  const renderStepUpload = (
    step: 1 | 2 | 3,
    image: File | null,
    preview: string | null,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => (
    <div key={step} className="space-y-3">
      <label
        htmlFor={`image${step}`}
        className="block text-lg font-semibold text-center"
      >
        Step-{step}
      </label>

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt={`Step ${step} preview`}
          className="w-full object-cover rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
        />
      )}

      {/* Select or Upload/Clear */}
      {!image ? (
        <label
          htmlFor={`image${step}`}
          className="w-full flex justify-center items-center px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-800"
        >
          Select File
          <input
            id={`image${step}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, step)}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => handleImageUpload(step, image)}
            className="flex-1 px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800"
          >
            Upload
          </button>
          <button
            onClick={() => {
              setImage(null);
              if (data) {
                if (step === 1) setPreview(data.step1 || null);
                if (step === 2) setPreview(data.step2 || null);
                if (step === 3) setPreview(data.step3 || null);
              }
            }}
            className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-700 text-white rounded hover:bg-red-600 dark:hover:bg-red-800"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-red-500 dark:text-red-400 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Settings
        </h1>
      </div>

      {/* Email */}
      <div className="mt-5 text-center space-y-4">
        <div>
          <label htmlFor="email" className="block text-lg font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-2/3 md:w-1/3 focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder={data?.email || "Enter your email"}
          />
          <button
            onClick={handleEmail}
            className="ml-3 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800"
          >
            Change
          </button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {renderStepUpload(1, image1, preview1, setImage1, setPreview1)}
          {renderStepUpload(2, image2, preview2, setImage2, setPreview2)}
          {renderStepUpload(3, image3, preview3, setImage3, setPreview3)}
        </div>
      </div>
    </div>
  );
}

export default Settings;
