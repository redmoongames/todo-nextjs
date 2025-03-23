# Modal Feature

A flexible and reusable modal system for React applications with Next.js.

## Features

- 🚀 Easy to use modal API
- 🎨 Customizable appearance and behavior
- 🔄 Animation support with Framer Motion
- 📏 Different modal sizes and positions
- 🔒 Focus trapping and accessibility features
- ⚡ Built-in hooks for common modal patterns (alerts, confirmations)

## Basic Usage

```tsx
import { useModal } from '@/features/modal';

function MyComponent() {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <div className="p-6">
        <h2>My Modal</h2>
        <p>Modal content here</p>
        <button onClick={closeModal}>Close</button>
      </div>
    );
  };

  return <button onClick={handleOpenModal}>Open Modal</button>;
}
```

## Using the ModalWrapper

For consistent styling and behavior, use the `ModalWrapper` component:

```tsx
import { useModal, ModalWrapper } from '@/features/modal';

function MyComponent() {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <ModalWrapper
        title="Modal Title"
        footer={
          <button 
            onClick={closeModal}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Close
          </button>
        }
      >
        <p>This is the modal content.</p>
      </ModalWrapper>
    );
  };

  return <button onClick={handleOpenModal}>Open Modal</button>;
}
```

## Modal Options

You can customize the modal appearance and behavior with options:

```tsx
openModal(
  <ModalWrapper title="Custom Modal">
    <p>Content here</p>
  </ModalWrapper>,
  {
    size: 'lg',                  // 'sm', 'md', 'lg', 'xl', 'full'
    position: 'top',             // 'center', 'top', 'right', 'bottom', 'left'
    closeOnEscape: true,         // close when Escape key is pressed
    closeOnBackdropClick: true,  // close when clicking outside the modal
    preventScroll: true,         // prevent body scrolling when modal is open
    showCloseButton: true,       // show the close button in the modal
    transitionDuration: 0.2,     // animation duration in seconds
    className: 'custom-modal'    // additional CSS classes
  }
);
```

## Quick Dialogs with useModalActions

For common modal patterns, use the `useModalActions` hook:

```tsx
import { useModalActions } from '@/features/modal';

function MyComponent() {
  const { alert, confirm, withForm } = useModalActions();

  const handleAlert = async () => {
    await alert({
      title: 'Success',
      message: 'Operation completed successfully',
      variant: 'success'
    });
    // Alert was closed
  };

  const handleConfirm = async () => {
    const result = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
      confirmVariant: 'danger'
    });

    if (result) {
      // User confirmed
    } else {
      // User cancelled
    }
  };

  // For form modals
  const handleFormModal = () => {
    withForm(
      FormComponent,  // Your form component
      {
        // Props to pass to the form
        onSubmit: (data) => console.log(data),
      },
      { size: 'md' }  // Optional modal options
    );
  };

  return (
    <div>
      <button onClick={handleAlert}>Show Alert</button>
      <button onClick={handleConfirm}>Show Confirmation</button>
      <button onClick={handleFormModal}>Show Form</button>
    </div>
  );
}
```

## Component Architecture

- `ModalProvider`: Context provider that manages modal state
- `Modal`: The modal container component with animations
- `ModalWrapper`: Standardized layout for modal content
- `useModal`: Hook to access the modal context
- `useModalActions`: Hook with helpers for common modal patterns

## Accessibility

This modal system follows accessibility best practices:

- Focus is trapped inside the modal when open
- The modal closes when Escape key is pressed
- Screen readers will announce the modal when it opens
- Modal content is properly labeled

## Creating Custom Modal Components

For reusable modal components, follow this pattern:

```tsx
function CustomModal({ onClose, ...props }) {
  return (
    <ModalWrapper title="Custom Modal" onClose={onClose}>
      {/* Modal content */}
      <div>
        {/* Custom modal content here */}
      </div>
      
      {/* Footer buttons */}
      <div className="flex justify-end space-x-3 mt-4">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Confirm
        </button>
      </div>
    </ModalWrapper>
  );
}

// Usage
const { openModal } = useModal();
openModal(<CustomModal onClose={() => openModal(null)} {...props} />);
``` 