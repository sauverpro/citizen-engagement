import React, { useState } from 'react';

export default function RegisterPage({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex items-center justify-center p-8 min-h-[calc(90vh-4rem)] bg-gradient-to-br mt-8  via-blue-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative w-full max-w-md">
        <div className="absolute align-center left-2/4 translate-x-1/2 flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-700 rounded-full shadow-lg animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8zm6 8v-2a6 6 0 00-12 0v2" /></svg>
        </div>
        <form
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-10 pt-16 w-full space-y-6 border border-blue-100 dark:border-gray-800"
          onSubmit={e => onRegister(e, { name, email, password })}
        >
          <h2 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-300 mb-2 tracking-tight">Create Account</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-4">Join the Citizen Engagement System today.</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-2 rounded-lg shadow-md font-semibold text-lg transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
