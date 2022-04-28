import React from 'react';
import RecoveryEmailComponent from './RecoveryEmailComponent';
import { useUser } from '../../contexts/ContextProvider';

export default function UpdateEmail() {
  const user = useUser();

  return (
    <>
      <div className='text-[#5f6368] text-base mt-8 max-w-xl mb-6'>
        <h1>Manage the email addresses associated with your Form Generator Account.</h1>
      </div>
      <div className='border min-w-[218px] border-[#dadce0] rounded-lg mb-6 max-w-[838px] px-6'>
        <div className='flex flex-col w-full pt-6 pb-2 flex-1'>
          <h1 className='email--title'>Account email</h1>
          <p className='email--desc'>
            The address used to identify your Account to you and others. You can't change this
            address.
          </p>
        </div>
        <div className='mt-3 mb-5 text-base'>{user.email}</div>
      </div>
      <RecoveryEmailComponent
        title='Recovery email'
        description="The address where we can contact you if there's unusual activity in your account or if you get locked out."
      ></RecoveryEmailComponent>
    </>
  );
}
