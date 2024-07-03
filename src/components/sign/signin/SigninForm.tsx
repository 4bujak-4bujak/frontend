import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useLogin from '@/hook/useLogin';
import { ISignIn } from '@/api/types/auth';

const SigninForm = () => {
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISignIn>();

  const { mutate, error } = useLogin();

  const FormSubmit = async (data: ISignIn) => {
    setIsError(false);
    const { email, password } = data;
    mutate({ email, password });
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isError) {
      timeoutId = setTimeout(() => {
        setIsError(false);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [isError]);

  return (
    <form
      onSubmit={handleSubmit((data) => FormSubmit(data))}
      className="max-w-[361px] mx-auto">
      <div className="flex">
        <label
          data-cy="sign-in-emailInput"
          htmlFor="email"
          className="text-neutral-600 text-base font-semibold font-pretendard">
          이메일
        </label>
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
      </div>

      <div className="mt-[18px] border-b border-neutral-300">
        <div className="pb-2 flex ">
          <div className="flex-grow flex">
            <input
              id="email"
              type="text"
              {...register('email', {
                required: true,
                pattern: {
                  value: /^[_a-zA-Z0-9-.]+@[.a-zA-Z0-9-]+\.[a-zA-Z]+$/,
                  message: '이메일 형식을 확인해주세요'
                }
              })}
              className="outline-none w-full"
              placeholder="이메일을 입력해주세요."
            />
          </div>
        </div>
      </div>
      {errors?.email ? (
        <div className="text-xs text-red-700 font-medium font-pretendard leading-tight">
          {errors.email.type === 'required'
            ? '필수 입력사항입니다.'
            : errors.email.message}
        </div>
      ) : (
        <div className="h-4"></div>
      )}

      <div className="flex mt-[32px]">
        <label
          data-cy="sign-in-passwordInput"
          htmlFor="password"
          className="text-neutral-600 text-base font-semibold font-pretendard">
          비밀번호
        </label>
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
      </div>

      <div className="mt-[18px] border-b border-neutral-300">
        <div className="pb-2 flex">
          <div className="flex-grow flex">
            <input
              {...register('password', {
                required: true
              })}
              type="password"
              className="outline-none w-full"
              placeholder="비밀번호를 입력해주세요."
              id="password"
            />
          </div>
        </div>
      </div>
      {errors?.password ? (
        <div className="text-xs text-red-700 font-medium font-pretendard leading-tight">
          {errors.password.type === 'required'
            ? '필수 입력사항입니다.'
            : errors.password.message}
        </div>
      ) : (
        <div className="h-4"></div>
      )}

      {error.length > 2 ? (
        <div
          className="mt-[16px] text-red-700 text-xs font-medium font-pretendard leading-tight"
          style={{ display: error ? 'block' : 'none' }}>
          *등록되지 않은 계정이거나 비밀번호가 올바르지 않습니다.
          <br />
          입력하신 내용을 다시 확인해주세요.
        </div>
      ) : (
        <div className="mb-[46px]"></div>
      )}

      <button
        id="signIn-Btn"
        className="mt-[66px] w-[361px] h-12 px-3.5 rounded-lg border border-black justify-center items-center inline-flex text-black text-[15px] font-semibold font-pretendard leading-snug"
        type="submit">
        로그인
      </button>
    </form>
  );
};

export default SigninForm;
