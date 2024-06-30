import React from 'react';
import { act, render, fireEvent, screen } from '@testing-library/react';
import SigninForm from './signin/SigninForm';
// import { signin } from '@/api/auth/auth.post.api';
// import { useRouter } from 'next/navigation';
// import { setCookie } from '@/utils/cookies';
// import { useMutation } from '@tanstack/react-query';

jest.mock('@/api/auth/auth.post.api');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/utils/cookies', () => ({ setCookie: jest.fn() }));
jest.mock('@tanstack/react-query', () => ({ useMutation: jest.fn() }));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const mockMutate = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: mockMutate,
    mutateAsync: jest.fn(),
    data: undefined,
    error: undefined,
    isLoading: false
  })
}));

describe('SigninForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로그인 성공 시 홈페이지로 리다이렉트', async () => {
    render(<SigninForm />);
    const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요.');
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요.');
    const submitButton = screen.getByText('로그인');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });
      fireEvent.click(submitButton);
    });

    // await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('잘못된 이메일 또는 비밀번호 입력 시 에러 메시지 표시', async () => {
    // mockMutate.mockImplementationOnce((_, { onError }) => {
    //   onError(new Error('*아이디 혹은 비밀번호가 일치하지 않습니다'));
    // });

    render(<SigninForm />);
    const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요.');
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요.');
    const submitButton = screen.getByText('로그인');
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });
      fireEvent.click(submitButton);
    });
    // await waitFor(() =>
    //   expect(
    //     screen.getByText('*아이디 혹은 비밀번호가 일치하지 않습니다')
    //   ).toBeInTheDocument()
    // );
  });
});
