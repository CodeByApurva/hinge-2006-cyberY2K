import React from 'react';
import { Outlet } from 'react-router-dom';
import TitleBar from './TitleBar';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import './AppShell.css';

export default function AppShell() {
  return (
    <div className="app-shell">
      <TitleBar />
      <Toolbar />
      <div className="app-shell__body">
        <Sidebar />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
