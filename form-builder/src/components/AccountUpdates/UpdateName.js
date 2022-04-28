import React, { useEffect, useRef, useState } from 'react';
import { useSetUser, useUser } from '../../contexts/ContextProvider';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import rippleTrigger from '../../functions/rippleTrigger';
import removeErrorSpecialInput from '../../functions/removeErrorSpecialInput';

export default function UpdateName() {
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const user = useUser();
  const setUser = useSetUser();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  });

  useEffect(() => {
    firstNameInputRef.current.value = formData.firstName;
    lastNameInputRef.current.value = formData.lastName;

    let cancelButton = document.querySelector('.cancel--button');
    let saveButton = document.querySelector('.save--button');
    cancelButton.addEventListener('click', (e) => rippleTrigger(e, 1000, cancelButton));
    saveButton.addEventListener('click', (e) => rippleTrigger(e, 1000, saveButton));

    const specialInput = document.querySelector('.special--input');

    function handleInputsBlur(e) {
      removeErrorSpecialInput(e);
    }

    specialInput.addEventListener('blur', handleInputsBlur);

    return () => {
      cancelButton.removeEventListener('click', (e) => rippleTrigger(e, 1000, cancelButton));
      saveButton.removeEventListener('click', (e) => rippleTrigger(e, 1000, saveButton));
    };
  }, []);

  useEffect(() => {
    const saveButton = document.querySelector('.save--button');
    if (formData.firstName === user.firstName && formData.lastName === user.lastName) {
      saveButton.disabled = true;
    } else {
      saveButton.disabled = false;
    }
  }, [formData]);

  function handleChange(e) {
    removeErrorSpecialInput(e);

    setError('');
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleCancel() {
    setTimeout(() => {
      window.history.go(-1);
    }, 300);
  }

  const navigate = useNavigate();

  function handleSave() {
    if (!formData.firstName.length) {
      //rgb(220 38 38 / 1)
      setError('Please enter a name.');

      const nameInput = document.querySelector('.special--input');
      const nameSpan = document.querySelector('.special--input--span');
      const errorLabel = document.querySelector('.error--label');
      const saveButton = document.querySelector('.save--button');

      saveButton.disabled = true;

      nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
      nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
      nameInput.style.setProperty('--hoverColor', 'rgb(153 27 27)');
      nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');

      nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
      nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
      nameSpan.style.setProperty('--hoverColor', 'rgb(153 27 27)');

      errorLabel.classList.add('active');
      return;
    }
    const docRef = doc(db, 'users', user.id);

    updateDoc(docRef, {
      firstName: formData.firstName,
      lastName: formData.lastName,
    }).then(async () => {
      const newUser = await getDoc(docRef);
      setUser({ ...newUser.data() });
      navigate('/manage-account');
    });
  }

  return (
    <>
      <div className='flex flex-col gap-8 text-[#5f6368] text-base mt-8 max-w-xl'>
        <h1>Changes to your name will be reflected across your account</h1>
        <div className='flex pl-[24px] pr-28 flex-col w-auto sm:border border-[#dadce0] rounded-lg py-3 gap-6'>
          <h1 className='text-[.6875rem] font-medium tracking-[.07272727em] uppercase'>
            change name
          </h1>
          <div className='mr-auto flex flex-col gap-10 mb-6'>
            <div className='flex flex-col gap-10 w-auto'>
              <div className='w-[400px] h-[56px] relative'>
                <input
                  type='text'
                  onChange={handleChange}
                  ref={firstNameInputRef}
                  className='special--input'
                  name='firstName'
                  required
                ></input>
                <span className='special--input--span'>First name</span>

                <label className='text-xs pl-[17px] text-red-600 error--label'>{error}</label>
              </div>
              <div className='w-[400px] h-[56px] relative'>
                <input
                  type='text'
                  onChange={handleChange}
                  ref={lastNameInputRef}
                  className='special--input'
                  name='lastName'
                  required
                ></input>
                <span className='special--input--span'>Last name</span>
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <button
                onClick={handleCancel}
                className='text-[#1a73e8] rounded px-[20px] py-[7px] font-medium text-sm hover:bg-blue-50 cancel--button relative overflow-hidden'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className='rounded px-[20px] py-[7px] font-medium text-sm save--button relative overflow-hidden'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
