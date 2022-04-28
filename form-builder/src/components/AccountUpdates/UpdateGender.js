import React, { useEffect, useRef, useState } from 'react';
import rippleTrigger from '../../functions/rippleTrigger';
import { useSetUser, useUser } from '../../contexts/ContextProvider';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function UpdateGender() {
  const user = useUser();
  const setUser = useSetUser();
  const [customGender, setCustomGender] = useState(user.gender); //text on the span of the checkbox for custom gender
  const [isCustomGender, setIsCustomGender] = useState(false); //determines if we should display a checkbox or a add custom gender button
  const [loading, setLoading] = useState(false); //true while updating the database
  const [isLoadingPopUp, setIsLoadingPopUp] = useState(false); //true for 5 sec after updating database
  const [textLoading, setTextLoading] = useState('Updating...'); //text of the popup that appears for 5 secs after updating database
  const [timeoutId, setTimeoutId] = useState(); //to reset the timer everytime we update
  const [error, setError] = useState(''); //text of the error label in custom gender modal
  const genderInputRef = useRef(); //so that input in the modal will always appear empty when after add custom gender button click
  const [isCustomGenderButtonHovered, setIsCutomGenderButtonHovered] = useState(false); //to change the color of the "+" sign on the buttonX
  let isEdited = useRef(false); //true if we clicked to edit our custom gender
  const [customGenderActualText, setCustomGenderActualText] = useState(''); //actual custom gender text that appears on the label
  //next to the radio button, as previously there was only customGender which updated at every key stroke
  //and so when we were editing it, the label in the background of the edit modal was updating too

  function specialRipples(color, button) {
    let ripples = document.createElement('span');
    ripples.classList.add('ripple');
    ripples.style.background = color;
    ripples.style.left = 50 + '%';
    ripples.style.top = 50 + '%';

    button.appendChild(ripples);
    document.querySelector('.ripple').style.setProperty('--animationTime', 2000 + 'ms');

    setTimeout(() => {
      button.removeChild(ripples);
      ripples.remove();
    }, 400);
  }

  function handleOuterClick(e) {
    document.querySelectorAll('.outer').forEach((outer) => {
      outer.style.setProperty('--hoverColor', 'rgb(243 244 246)'); //normal hover
    });

    let input;
    if (e.target.nodeName === 'INPUT') {
      input = e.target; //if we click exactly on the input
    } else if (e.target.nodeName === 'SPAN') {
      input = e.target.previousElementSibling.firstElementChild; //if we click on the text next to the input
    } else {
      input = e.target.children[0]; //if we click at the border that appears around when we hover
    }
    input.checked = true;

    const dataUpdate = input.parentElement.nextSibling.textContent;
    setLoading(false);
    setIsLoadingPopUp(false);
    clearTimeout(timeoutId);

    updateDatabase('gender', dataUpdate);

    setIsCustomGender(false);

    const outer = input.parentElement;
    outer.style.setProperty('--hoverColor', 'rgb(239 246 255)'); //blue hover
  }

  useEffect(() => {
    const overlay = document.getElementById('overlay');
    function handleOverlay() {
      document.querySelector('.modal').classList.remove('active');
      removeErrorLabel();
      overlay.classList.remove('active');
    }
    overlay.addEventListener('click', handleOverlay);

    const spans = document.querySelectorAll('.gender--span');
    let found = false;
    spans.forEach((span) => {
      if (span.textContent == user.gender) {
        span.previousSibling.firstChild.checked = true;
        found = true; //to check the right checkbox on load
      }
    });

    if (!isCustomGender) {
      const customGenderButton = document.querySelector('.custom--gender');
      customGenderButton.addEventListener('mouseenter', () => {
        setIsCutomGenderButtonHovered(true);
      });
      customGenderButton.addEventListener('mouseleave', () => {
        setIsCutomGenderButtonHovered(false);
      });
    }

    const specialInput = document.querySelector('.special--input');

    function handleInputsBlur(e) {
      removeErrorSpecialInput();
      removeErrorLabel();
    }

    specialInput.addEventListener('blur', handleInputsBlur);

    const buttons = document.querySelectorAll('.outer');
    buttons.forEach((button) => {
      button.addEventListener('click', () => specialRipples('rgb(219 234 254)', button));
    });

    if (!found) {
      setIsCustomGender(true);
      setCustomGenderActualText(user.gender);
    }
  }, []);

  function handleCancelModal() {
    removeErrorLabel();
    removeErrorSpecialInput();

    document.querySelector('.modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
  }

  useEffect(() => {
    if (isCustomGender) {
      document.querySelectorAll('.outer').forEach((outer) => {
        outer.style.setProperty('--hoverColor', 'rgb(243 244 246)'); //normal hover
      });
      const outer = document.getElementById('special--outer');
      outer.style.setProperty('--hoverColor', 'rgb(239 246 255)'); //blue hover
      outer.addEventListener('click', () => specialRipples('rgb(219 234 254)', outer));

      const pencil = document.querySelector('.pencil--holder');
      pencil.addEventListener('click', () => specialRipples('rgb(212 212 216)', pencil));
    } else {
      const addGenderButton = document.querySelector('.cancel--button');
      addGenderButton.addEventListener('click', (e) => rippleTrigger(e, 200, addGenderButton));
    }
  }, [isCustomGender]);

  function updateDatabase(property, value) {
    const docRef = doc(db, 'users', user.id);
    setLoading(true);
    setIsLoadingPopUp(true);

    updateDoc(docRef, {
      [property]: value,
    }).then(async () => {
      setTimeout(() => {
        setLoading(false);
      }, 300); //to imitate uploading time
      const newUser = await getDoc(docRef);
      setUser({
        ...newUser.data(),
      });
    });
  }

  useEffect(() => {
    setTextLoading('Updating...');
    if (!loading) {
      setTextLoading('Updated');

      const id = setTimeout(() => {
        setIsLoadingPopUp(false);
      }, 5000);
      setTimeoutId(id);
    }
  }, [loading]);

  function addErrorClasses() {
    const nameInput = document.querySelector('.special--input');
    const nameSpan = document.querySelector('.special--input--span');
    const errorLabel = document.querySelector('.error--label');

    nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
    nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
    nameInput.style.setProperty('--hoverColor', 'rgb(153 27 27)');
    nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');

    nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
    nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
    nameSpan.style.setProperty('--hoverColor', 'rgb(153 27 27)');

    errorLabel.classList.add('active');
  }
  function removeErrorLabel() {
    const errorLabel = document.querySelector('.error--label');
    errorLabel.classList.remove('active');
  }

  function removeErrorSpecialInput() {
    const nameInput = document.querySelector('.special--input');

    nameInput.style.setProperty('--borderColor', '#1a73e8');
    nameInput.style.setProperty('--normalBorderColor', '#888c8f');
    nameInput.style.setProperty('--hoverColor', '#161616');
    nameInput.style.setProperty('--focusBorderColor', '#1a73e8');

    const nameSpan = document.querySelector('.special--input--span');

    nameSpan.style.setProperty('--fontColor', '#1a73e8');
    nameSpan.style.setProperty('--normalFontColor', '#5f6368');
    nameSpan.style.setProperty('--hoverColor', '#161616');
  }

  function handleConfirmModal() {
    if (isEdited) {
      if (!customGender.length) {
        addErrorClasses();
        setError('Please use at least one letter.');
        return;
      }

      updateDatabase('gender', customGender);
      setCustomGenderActualText(customGender);
      setIsCustomGender(true);
      removeErrorLabel();
      removeErrorSpecialInput();

      document.querySelector('.modal').classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
    } else {
      if (!customGender.length) {
        addErrorClasses();
        setError('Please use at least one letter.');
        return;
      }

      updateDatabase('gender', customGender);
      setCustomGenderActualText(customGender);
      setIsCustomGender(true);
      removeErrorLabel();
      removeErrorSpecialInput();

      document.querySelector('.modal').classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
    }
  }

  function customGenderClick() {
    setCustomGender('');
    genderInputRef.current.value = '';

    document.querySelector('.modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    removeErrorLabel();
    removeErrorSpecialInput();
  }

  function editCustomGenderClick() {
    genderInputRef.current.value = customGender;
    isEdited = true;

    document.querySelector('.modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    removeErrorLabel();
    removeErrorSpecialInput();
  }

  function handleChangeModal(e) {
    removeErrorLabel();
    removeErrorSpecialInput();
    setCustomGender((prev) => e.target.value);
  }

  return (
    <>
      <div className='modal bg-white flex flex-col min-w-[280px] min-h-[220px]'>
        <div className='modal--header pb-7 pt-6 px-[24px]'>
          <div className='title font-[500] text-[1rem] tracking-[.00625em] text-[#3c4043]'>
            Gender
          </div>
        </div>

        <div className='flex'>
          <div className='px-6'>
            <div className='w-[232px] h-[56px] relative'>
              <input
                type='text'
                onChange={handleChangeModal}
                ref={genderInputRef}
                className='special--input'
                required
              ></input>
              <span className='special--input--span special--span--small'>Enter your gender</span>
            </div>
            <label className='text-xs text-red-600 error--label min-h-[20px] pl-[17px] pointer-events-none'>
              {error}
            </label>
          </div>
        </div>

        <div className='modal--footer flex justify-end pt-[20px] pr-6'>
          <button
            onClick={handleCancelModal}
            className='text-special-gray rounded px-[10px] py-[7px] font-medium text-sm hover:bg-gray-50 overflow-hidden'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmModal}
            className='text-[#1a73e8] rounded px-[10px] py-[7px] font-medium text-sm hover:bg-blue-50 overflow-hidden'
          >
            Save
          </button>
        </div>
      </div>

      <div id='overlay'></div>

      {isLoadingPopUp && (
        <div className='loading--popup'>
          <div className='w-[344px] h-[48px] bg-black rounded-md flex items-center'>
            <span className='text-[#e8eaed] pl-5'>{textLoading}</span>
          </div>
        </div>
      )}

      <div className='mt-8 w-auto'>
        <h1 className='gender--description text-[#5f6368] text-base'>
          Your gender may be used for personalization across Form Generator, including how we refer
          to you.
        </h1>
        <div className='flex pl-[24px] pr-8 flex-col sm:border max-w-[621px] border-[#dadce0] rounded-lg py-6 gap-6 mt-7'>
          <h1 className='text-[.6875rem] font-medium tracking-[.07272727em] uppercase text-[#5f6368]'>
            gender
          </h1>

          <div className='pl-2'>
            <div className='w-full py-1'>
              <div className='flex items-center justify-start gap-4'>
                <div className='outer relative overflow-hidden' onClick={handleOuterClick}>
                  <input type='radio' name='gender' className='radio--holder'></input>
                </div>

                <span
                  className='text-[.875rem] tracking-[.0142857143em] cursor-default gender--span'
                  onClick={handleOuterClick}
                >
                  Female
                </span>
              </div>
            </div>
            <div className='w-full py-1'>
              <div className='flex items-center justify-start gap-4'>
                <div className='outer relative overflow-hidden' onClick={handleOuterClick}>
                  <input type='radio' name='gender' className='radio--holder'></input>
                </div>
                <span
                  className='text-[.875rem] tracking-[.0142857143em] cursor-default gender--span'
                  onClick={handleOuterClick}
                >
                  Male
                </span>
              </div>
            </div>
            <div className='w-full py-1'>
              <div className='flex items-center justify-start gap-4'>
                <div className='outer relative overflow-hidden' onClick={handleOuterClick}>
                  <input type='radio' name='gender' className='radio--holder'></input>
                </div>
                <span
                  className='text-[.875rem] tracking-[.0142857143em] cursor-default gender--span'
                  onClick={handleOuterClick}
                >
                  Rather not to say
                </span>
              </div>
            </div>
            {isCustomGender && (
              <div className='w-full py-1'>
                <div className='flex items-center justify-start gap-4'>
                  <div className='outer relative overflow-hidden' id='special--outer'>
                    <input
                      type='radio'
                      name='gender'
                      className='radio--holder'
                      defaultChecked
                    ></input>
                    <div className='dot'></div>
                  </div>
                  <span className='text-[.875rem] tracking-[.0142857143em] cursor-default'>
                    {customGenderActualText}
                  </span>
                  <div
                    className='ml-auto p-2 rounded-full hover:bg-gray-100 cursor-pointer relative overflow-hidden pencil--holder'
                    onClick={editCustomGenderClick}
                  >
                    <svg
                      focusable='false'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      className='relative z-50'
                    >
                      <path d='M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z'></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {!isCustomGender && (
              <div className='mt-5'>
                <button
                  className='cancel--button custom--gender flex justify-center gap-2 items-center border-[#dadce0] border px-[15px] py-2 rounded-[4px] hover:bg-blue-50 hover:text-[#174ea6] relative overflow-hidden font-medium text-[0.875rem] text-[#1a73e8]'
                  onClick={customGenderClick}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 pointer-events-none'
                    viewBox='0 0 20 20'
                    fill={isCustomGenderButtonHovered ? '#174ea6' : '#1a73e8'}
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Add custom gender
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
