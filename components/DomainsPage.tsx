"use client";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DomainData {
  data: {
    domains: string[];
  };
}

function DomainsPage() {
  const [data, setData] = useState<DomainData | null>(null);
  const [newDomain, setNewDomain] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: AxiosResponse<DomainData> = await axios.get<DomainData>(
          "/api/admin/getData"
        );
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    try {
      const res: AxiosResponse<DomainData> = await axios.post<DomainData>(
        "/api/admin/add-domain",
        { domain: newDomain }
      );
      setData(res.data);
      setNewDomain("");
    } catch (error: unknown) {
      toast.error(
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const handleDeleteDomain = async ({ domain }: { domain: string }) => {
    try {
      const res: AxiosResponse<DomainData> = await axios.post<DomainData>(
        "/api/admin/delete-domain",
        { domain }
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Manage Domains</h1>

        {/* Add Domain */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="Enter new domain"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddDomain}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        {/* Domain List */}
        <div className="space-y-3">
          {data?.data?.domains?.length ? (
            data.data.domains.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
              >
                <p className="truncate">{item}</p>
                <button
                  onClick={() => handleDeleteDomain({ domain: item })}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No domains added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DomainsPage;
