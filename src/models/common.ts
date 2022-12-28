import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export type CustomNextPage = NextPage & {
  Layout?: (props: LayoutProps) => ReactElement;
  Canvas?: (props: any) => ReactNode;
};

export type CustomAppProps = AppProps & {
  Component: CustomNextPage;
};
