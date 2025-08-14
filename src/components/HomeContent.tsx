// src/components/HomeContent.tsx
import React from 'react';

interface HomeContentProps {
  username: string;
}

const HomeContent: React.FC<HomeContentProps> = ({ username }) => {
  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Hello, {username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Chào mừng bạn quay trở lại hệ thống.
        </p>
      </div>
    </main>
  );
};

export default HomeContent;
