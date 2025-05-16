import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-[#25C935] to-[#1ea32b] bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Page Not Found
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div>
          <Link to="/">
            <Button className="bg-gradient-to-r from-[#25C935] to-[#1ea32b] hover:from-[#1ea32b] hover:to-[#25C935] transition-all duration-300">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};