'use client';
import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '../wagmi';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
        accentColor: "#212F3C",
        accentColorForeground: "#ffffff",
        borderRadius: "medium",
        fontStack: "system",
      })}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}