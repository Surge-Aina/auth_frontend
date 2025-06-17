import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the dashboard components
jest.mock('./components/AdminDashboard', () => () => <div>Admin Dashboard</div>);
jest.mock('./components/ManagerDashboard', () => () => <div>Manager Dashboard</div>);
jest.mock('./components/WorkerDashboard', () => () => <div>Worker Dashboard</div>);
jest.mock('./components/CustomerDashboard', () => () => <div>Customer Dashboard</div>);

describe('App Component', () => {
  test('renders login page by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
