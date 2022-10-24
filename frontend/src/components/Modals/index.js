import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginFormPage from '../LoginFormPage';
import SignupFormPage from '../SignupFormPage';
import LanguageSelectChoice from '../LanguageSelectChoice'

function ModalFunctions() {
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalSignup, setShowModalSignup] = useState(false);
  const [showModalLanguage, setShowModalLanguage] = useState(false);

  let modalType;

  return (
    <>
     {/* <button onClick={() => {
        setShowModalLanguage(true)
        setShowModalLogin(false)
        setShowModalSignup(false)
      } }
      className="cursor-pointer"
      >English
      </button>
      {showModalLanguage && (
        <Modal onClose={() => setShowModalLanguage(false)}>
          <LanguageSelectChoice />
        </Modal>
      )} */}
      <button onClick={() => {
        setShowModalLogin(true)
        setShowModalSignup(false)
        setShowModalLanguage(false)
      } }
      className="cursor-pointer"
      >Log In
      </button>
      {showModalLogin && (
        <Modal onClose={() => setShowModalLogin(false)}>
          <LoginFormPage />
        </Modal>
      )}

      <button onClick={() => {
        setShowModalSignup(true)
        setShowModalLogin(false)
        setShowModalLanguage(false)
      }}
      className="cursor-pointer"
      >Sign Up
      </button>
      {showModalSignup && (
        <Modal onClose={() => setShowModalSignup(false)}>
          <SignupFormPage />
        </Modal>
      )}

    </>
  );
}

// export function SignupFormModal() {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>

//     </>
//   );
// }

// export function LanguageSelectModal() {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>

//     </>
//   );
// }



export default ModalFunctions;
