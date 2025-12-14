
import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;

    return () => {
      // Optional: Reset to default title when component unmounts
      document.title = 'Online Store';
    };
  }, [title]);
}
