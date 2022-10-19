import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginFormPage from '../LoginFormPage';
import SignupFormPage from '../SignupFormPage';
import LanguageSelectChoice from '../LanguageSelectChoice'

export function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}
      className="cursor-pointer"
      >Log In
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginFormPage />
        </Modal>
      )}
    </>
  );
}

export function SignupFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}
      className="cursor-pointer"
      >Sign Up
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupFormPage />
        </Modal>
      )}
    </>
  );
}

export function LanguageSelectModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}
      className="cursor-pointer"
      >English
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LanguageSelectChoice />
        </Modal>
      )}
    </>
  );
}



// export default LoginFormModal;
