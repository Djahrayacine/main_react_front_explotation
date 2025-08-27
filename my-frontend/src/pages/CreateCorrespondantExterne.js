import React from 'react';
import DynamicForm from '../components/DynamicForm';

function App() {
  return (
    <div>
      <h2>Créer Correspondant Externe</h2>
      <DynamicForm
        endpoint="http://localhost:8080/api/correspondants/externe"
        fields={["name", "adresse", "phone_num", "fax", "e_mail"]}
      />
    </div>
  );
}

export default App;
