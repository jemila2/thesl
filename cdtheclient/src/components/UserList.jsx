import { useAuth } from './AuthContext';

function UserList() {
  const { users, usersLoading, getAllUsers } = useAuth();

  useEffect(() => {
  const fetchUsers = async () => {
  try {
    console.log('[FRONTEND] Making request to /api/admin/users');
    const response = await axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('[FRONTEND] Response:', response.data);
    
    if (response.data.success) {
      setUsers(response.data.data || []);
    } else {
      console.error('[FRONTEND] API Error:', response.data.message);
    }
  } catch (error) {
    console.error('[FRONTEND] Request Failed:', {
      status: error.response?.status,
      data: error.response?.data
    });
  }
};
    
    fetchUsers();
  }, []);

  if (usersLoading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList