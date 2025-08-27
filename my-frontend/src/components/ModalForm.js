
import DynamicFormModal from './DynamicFormModal'; // Your existing form component

const ModalForm = ({ 
  isOpen, 
  onClose, 
  fields, 
  endpoint, 
  initialData ,
    onSuccess 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="modal-header">
          <h2>Edit Record</h2>
          <p>ID: {initialData.idCC} (Immutable)</p>
        </div>

        <div className="modal-body">
          <DynamicFormModal 
            fields={fields}
            endpoint={endpoint}
            initialData={initialData}
            onSuccess={onSuccess}  
          />
        </div>
      </div>
    </div>
  );
};

export default ModalForm;