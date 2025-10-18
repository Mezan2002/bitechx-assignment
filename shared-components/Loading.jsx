"use client";

const Loading = ({ fullPage = false }) => {
  const content = (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
