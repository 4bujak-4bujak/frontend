import { getCookie } from '@/utils/cookies';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthenticationProviderProps {
  children: ReactNode;
}

const AuthorizationProvider = ({ children }: AuthenticationProviderProps) => {
  const router = useRouter();
  const token = getCookie('token');
  const pathname = usePathname();

  useEffect(() => {
    if (
      !token &&
      pathname !== '/signin' &&
      pathname !== '/signup' &&
      pathname !== '/sign/findpassword'
    ) {
      router.push('/sign');
    }
  }, [router, token, pathname]);

  return <>{children}</>;
};

export default AuthorizationProvider;
