import React, { useEffect } from 'react';
import { useUser } from '../../contexts/ContextProvider';
import rippleTrigger from '../../functions/rippleTrigger';

export default function ManageEmailComponent(props) {
  const user = useUser();

  useEffect(() => {
    if (!user.recoveryEmail) {
      const button = document.querySelector('.save--button');
      button.addEventListener('click', (e) => rippleTrigger(e, 400, button));
    }
  }, []);

  function handleClick() {}

  function addRecoveryEmail() {
    //redirect to login page
  }

  return (
    <>
      <div className='border min-w-[218px] border-[#dadce0] rounded-lg mb-6 max-w-[838px]'>
        <div className='flex flex-col w-full px-6 pt-6 pb-2 flex-1'>
          <h1 className='email--title'>{props.title}</h1>
          <p className='email--desc'>{props.description}</p>
        </div>
        {user.recoveryEmail ? (
          <div className='hover:bg-gray-100 cursor-pointer account--info--item relative'>
            <div onClick={handleClick} className='flex flex-col py-4 items-center'>
              <div className='w-full flex items-center px-6'>
                <div className='w-[80%] flex items-center template--account--info'>
                  <div className='flex items-center mr-[24px] pt-1 secondbasis--manage--account--title'>
                    <span className='leading-4 text-base'>{user.recoveryEmail}</span>
                  </div>
                  <div className='mr-[24px] flex flex-grow flex-shrink secondbasis--manage-account--desc'>
                    <span></span>
                  </div>
                </div>
                <div className='ml-auto'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='#161616'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='px-6 pb-5 mt-3'>
            <button
              onClick={addRecoveryEmail}
              className='rounded-md relative px-7 overflow-hidden py-2 text-white text-sm font-medium save--button'
            >
              Add recovery email
            </button>
          </div>
        )}
      </div>
    </>
  );
}
