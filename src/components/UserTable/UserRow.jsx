import React from 'react';

const UserRow = ({ user, onEdit, onDelete, onView }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.agency?.name || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={() => onView(user)}
          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md hover:bg-blue-50"
        >
          View
        </button>
        <button
          onClick={() => onEdit(user)}
          className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded-md hover:bg-indigo-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user)}
          className="text-red-600 hover:text-red-900 px-2 py-1 rounded-md hover:bg-red-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserRow; 