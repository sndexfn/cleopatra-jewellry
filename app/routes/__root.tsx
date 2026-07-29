import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import React from 'react';
import '../../src/styles.css'; // ربط ملف الألوان الفاخرة

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Meta />
      {/* سيتم إضافة شريط التنقل (Navbar) هنا لاحقاً */}
      <main className="min-h-screen bg-cleopatra-deepSea text-gray-100 flex flex-col">
        <Outlet />
      </main>
      <ScrollRestoration />
      <Scripts />
    </React.Fragment>
  );
}
