import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-6xl sm:text-8xl font-bold text-red-500 mb-4">
          ⚠️
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {error?.message || "An unexpected error occurred"}
        </p>
        <div className="space-y-4">
          <div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#25C935] to-[#1ea32b] hover:from-[#1ea32b] hover:to-[#25C935] transition-all duration-300"
            >
              Try Again
            </Button>
          </div>
          <div>
            <Link to="/">
              <Button
                variant="outlined"
                className="border-[#25C935] text-[#25C935] hover:bg-[#25C935] hover:text-white transition-all duration-300"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};