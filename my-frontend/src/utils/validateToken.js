export const validateToken = async () => {
  try {
    console.log('All cookies:', document.cookie);
    
    const response = await fetch('http://localhost:8081/api/auth/validate', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Validation response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      return data.valid === true;
    } else {
      console.error('Token validation failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};