/* 
  This file contains examples of how to use the modal system.
  It's not meant to be imported, just used as documentation.
*/

// Basic usage
import { useModal } from '@/features/modal';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BasicExample() {
  const { openModal, closeModal } = useModal();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenModal = () => {
    openModal(
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Simple Modal</h2>
        <p className="mb-4">This is a simple modal example.</p>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    );
  };
}

// Using ModalWrapper
import { useModal as useModalWrapper, ModalWrapper } from '@/features/modal';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ModalWrapperExample() {
  const { openModal } = useModalWrapper();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenModal = () => {
    openModal(
      <ModalWrapper
        title="Modal with ModalWrapper"
        footer={
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => console.log('Action confirmed')}
          >
            Confirm
          </button>
        }
      >
        <p>This modal uses the ModalWrapper component for consistent styling.</p>
      </ModalWrapper>
    );
  };
}

// Using modal options
import { useModal as useModalOptions, ModalWrapper as ModalWrapperOptions } from '@/features/modal';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ModalOptionsExample() {
  const { openModal } = useModalOptions();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenModal = () => {
    openModal(
      <ModalWrapperOptions title="Modal with Options">
        <p>This modal has custom size, position, and behavior.</p>
      </ModalWrapperOptions>,
      {
        size: 'lg',
        position: 'top',
        closeOnEscape: false,
        closeOnBackdropClick: false,
        transitionDuration: 0.3
      }
    );
  };
}

// Using useModalActions for quick dialogs
import { useModalActions } from '@/features/modal';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ModalActionsExample() {
  const { alert, confirm, withForm } = useModalActions();
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAlert = async () => {
    await alert({
      title: 'Success',
      message: 'Your changes have been saved.',
      variant: 'success'
    });
    console.log('Alert closed');
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleConfirm = async () => {
    const result = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      confirmVariant: 'danger'
    });
    
    if (result) {
      console.log('Confirmed deletion');
    } else {
      console.log('Cancelled deletion');
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleForm = () => {
    interface FormData {
      name: string;
    }
    
    interface FormProps {
      onSubmit: (data: FormData) => void;
      onClose: () => void;
    }
    
    const MyFormComponent = ({ onSubmit, onClose }: FormProps) => (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name: 'Sample' }); }}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Form Modal</h2>
          <input className="mb-4 p-2 w-full" placeholder="Enter name" />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    );
    
    withForm(
      MyFormComponent,
      {
        onSubmit: (data: FormData) => {
          console.log('Form submitted:', data);
        }
      },
      { size: 'md' }
    );
  };
} 