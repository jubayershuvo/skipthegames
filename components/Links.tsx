"use client";

import React from "react";
import toast from "react-hot-toast";

interface LinkItem {
  _id: string;
  link: string;
  domain: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface LinksProps {
  links: LinkItem[];
}

const Links: React.FC<LinksProps> = ({ links }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator?.clipboard?.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast.error("Failed to copy!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-4">
        {links?.map((item, index) => {
          const url = `${item.domain}/${item.link}`;
          return (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Link */}
              <div className="flex-1 w-full md:w-auto mb-2 md:mb-0">
                <p className="text-gray-800 dark:text-gray-200 font-medium break-words">
                  {index + 1}.{" "}
                  <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {url}
                  </span>
                </p>
              </div>

              {/* Time */}
              <div className="w-full md:w-auto text-gray-500 dark:text-gray-400 text-sm mb-2 md:mb-0">
                {new Date(item.createdAt).toLocaleString()}
              </div>

              {/* Copy Button */}
              <div className="w-full md:w-auto">
                <button
                  onClick={() => copyToClipboard(url)}
                  className="bg-blue-500 ml-1 cursor-pointer text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {links.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No links available.
        </p>
      )}
    </div>
  );
};

export default Links;
