import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import React from 'react';
import '../../src/styles.css';
import { Navbar } from '../components/Navbar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Meta />
      <div className="min-h-screen bg-cleopatra-deepSea text-gray-100 flex flex-col font-sans">
        {/* شريط التنقل العلوي الفاخر */}
        <Navbar />
        
        {/* مكان شريط أسعار الذهب اللحظية (سنقوم ببرمجته وإضافته هنا قريباً) */}
        
        {/* محتوى الصفحات */}
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
      <Scripts />
    </React.Fragment>
  );
}
