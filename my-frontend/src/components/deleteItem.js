import axios from 'axios';

// Basic delete function - takes endpoint and id
async function deleteItem(endpoint, id) {
  try {
    // Send DELETE request to: endpoint/id
    const response = await axios.delete(`${endpoint}/${id}`);
    
    // Return success
    return {
      success: true,
      message: 'Item deleted successfully',
      data: response.data
    };
    
  } catch (error) {
    // Return error
    return {
      success: false,
      message: 'Error deleting item',
      error: error.response?.data || error.message
    };
  }
}

export default deleteItem;
