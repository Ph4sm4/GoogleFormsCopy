import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { animated, useSpring, config, useChain, useSpringRef } from 'react-spring';

export default function ShowPassword(props) {
  const checkboxAnimationRef = useSpringRef();

  const passwordShown = props.passwordShown;
  const setPasswordShown = props.setPasswordShown;
  const checkBoxRef = useRef();
  const checkboxAnimationStyle = useSpring({
    backgroundColor: passwordShown ? '#1a73e8' : 'white',
    borderColor: passwordShown ? '#1a73e8' : '#5f6368',
    config: config.gentle,
    ref: checkboxAnimationRef,
  });

  const [checkmarkLength, setCheckmarkLength] = useState(null);
  const checkmarkAnimationRef = useSpringRef();

  const checkmarkAnimationStyle = useSpring({
    x: passwordShown ? 0 : checkmarkLength,
    config: config.gentle,
    ref: checkmarkAnimationRef,
  });
  useChain(
    passwordShown
      ? [checkboxAnimationRef, checkmarkAnimationRef]
      : [checkmarkAnimationRef, checkboxAnimationRef],
    [0, 0.1]
  );
  useEffect(() => {
    if (passwordShown) {
      checkBoxRef.current.checked = true;
    } else {
      checkBoxRef.current.checked = false;
    }
  }, [passwordShown]);

  function handleShowPassword() {
    setPasswordShown((prev) => !prev);
  }

  function pathHandler(ref) {
    if (ref) {
      setCheckmarkLength(ref.getTotalLength());
    }
  }

  return (
    <div className={`w-full flex items-center relative ${!props.error ? 'mt-2' : 'mt-0'}`}>
      <div className='relative z-10'>
        <label className='showpassword--holder'>
          <input type='checkbox' ref={checkBoxRef} onClick={handleShowPassword}></input>
          <animated.svg
            style={checkboxAnimationStyle}
            className={`checkbox cursor-pointer`}
            aria-hidden='true'
            viewBox='0 0 15 11'
            fill='none'
          >
            <animated.path
              d='M1 4.5L5 9L14 1'
              strokeWidth='2'
              stroke={passwordShown ? '#fff' : 'none'}
              strokeDasharray={checkmarkLength}
              strokeDashoffset={checkmarkAnimationStyle.x}
              ref={pathHandler}
            ></animated.path>
          </animated.svg>
        </label>
      </div>

      <div onClick={handleShowPassword} className='ml-4 cursor-pointer text-sm'>
        Show password
      </div>
    </div>
  );
}
