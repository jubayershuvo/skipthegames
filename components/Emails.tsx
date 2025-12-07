"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the Email interface based on your API response structure.
interface Email {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  attachments: Attachment[];
  labelIds: string[];
}

interface Attachment {
  filename?: string | null;
  mimeType?: string | null;
  data?: string | null | undefined;
}

const Emails: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setEmail(urlParams.get("email"));
    }
  }, []);

  // Fetch emails from the API on component mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`/api/admin/emails/user?email=${email}`);
        console.log("API Response:", response.data);
        setEmails(response.data.emails);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError("Error fetching emails");
        setLoading(false);
      }
    };

    if (email) {
      fetchEmails();
    }
  }, [email]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Email Inbox
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
            Managing emails for: <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>
          </p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Email List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {emails.map((emailItem) => (
            <div
              key={emailItem.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer overflow-hidden group"
              onClick={() => setSelectedEmail(emailItem)}
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                    {emailItem.labelIds?.[0] || "Inbox"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(emailItem.date)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {emailItem.subject || "No Subject"}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {emailItem.snippet}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span className="truncate max-w-[120px] md:max-w-[140px]">
                    From: {emailItem.from.split('<')[0]}
                  </span>
                  {emailItem.attachments.length > 0 && (
                    <span className="flex items-center text-blue-600 dark:text-blue-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      {emailItem.attachments.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && emails.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-200">
                No emails found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                There are no emails to display for this account.
              </p>
            </div>
          </div>
        )}

        {/* Modal Popup */}
        {selectedEmail && (
          <div 
            className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={() => setSelectedEmail(null)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 truncate">
                      {selectedEmail.subject || "No Subject"}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm opacity-90">
                      <span><strong>From:</strong> {selectedEmail.from}</span>
                      <span><strong>To:</strong> {selectedEmail.to}</span>
                      <span><strong>Date:</strong> {formatDate(selectedEmail.date)}</span>
                    </div>
                  </div>
                  <button
                    className="text-white hover:text-gray-200 transition-colors text-2xl font-light bg-black bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center ml-4 flex-shrink-0"
                    onClick={() => setSelectedEmail(null)}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto bg-white dark:bg-gray-800">
                <div className="prose prose-blue max-w-none dark:prose-invert flex items-center">
                  <div 
                    className="p-4 border text-black dark:text-white border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 email-body-content mx-auto"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                  />
                </div>

                {/* Attachments */}
                {selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                      Attachments ({selectedEmail.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedEmail.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {attachment.filename || `Attachment ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Emails;