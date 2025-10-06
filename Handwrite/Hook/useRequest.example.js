import React, { useState } from 'react';
import useRequest from './useRequest';

// 模拟 API 请求函数
const fetchUser = async (userId) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return response.json();
};

// 使用示例组件
function UserProfile() {
  const [userId, setUserId] = useState(1);
  
  const { data: user, loading, error, refresh } = useRequest(
    () => fetchUser(userId),
    [userId] // userId 变化时重新请求
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <button onClick={() => setUserId(userId + 1)}>Next User</button>
      <button onClick={refresh}>Refresh</button>
      
      {user && (
        <div>
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
