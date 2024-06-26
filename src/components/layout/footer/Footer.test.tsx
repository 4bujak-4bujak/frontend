import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/components/layout/footer/Footer';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

describe('Footer 컴포넌트', () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: pushMock
    }));
    (usePathname as jest.Mock).mockImplementation(() => '/'); // 기본 경로를 '/'로 설정
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('정상적으로 렌더링되는지 확인', () => {
    render(<Footer />);
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('예약')).toBeInTheDocument();
    expect(screen.getByText('내 주변')).toBeInTheDocument();
    expect(screen.getByText('커뮤니티')).toBeInTheDocument();
    expect(screen.getByText('마이')).toBeInTheDocument();
  });

  test('각 링크가 올바른 경로로 이동하는지 확인', () => {
    render(<Footer />);
    expect(screen.getByText('홈').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('예약').closest('a')).toHaveAttribute('href', '/reservation');
    expect(screen.getByText('내 주변').closest('a')).toHaveAttribute('href', '/map');
    expect(screen.getByText('마이').closest('a')).toHaveAttribute('href', '/mypage');
  });

  test('현재 경로에 따라 활성 링크 스타일이 적용되는지 확인', () => {
    (usePathname as jest.Mock).mockImplementation(() => '/community');
    render(<Footer />);
    expect(screen.getByAltText('community')).toHaveAttribute(
      'src',
      '/CheckedCommunity.svg'
    );
  });

  test('커뮤니티 클릭 시 세션 스토리지에서 데이터가 제거되고, /community로 이동하는지 확인', () => {
    sessionStorage.setItem('scrollPosition', '123');
    sessionStorage.setItem('savedData', 'data');
    render(<Footer />);
    fireEvent.click(screen.getByText('커뮤니티'));
    expect(sessionStorage.getItem('scrollPosition')).toBeNull();
    expect(sessionStorage.getItem('savedData')).toBeNull();
    expect(pushMock).toHaveBeenCalledWith('/community');
  });
});
