"use client";

const Loading = ({ fullPage = false }) => {
  const content = (
    <div className="flex items-center justify-center">
      {/* Black circular spinner with no fill, just border */}
      <div className="animate-spin rounded-full size-12 border-4 border-black border-t-transparent"></div>
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
