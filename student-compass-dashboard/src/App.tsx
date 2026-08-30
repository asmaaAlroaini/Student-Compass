import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '@/app/router';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { useThemeStore } from '@/app/store/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const resolvedTheme = useThemeStore((state) => state.resolved);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          theme={resolvedTheme}
          position="top-center"
          dir="rtl"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Almarai, Inter Variable, sans-serif',
              direction: 'rtl',
              fontSize: '14px',
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
