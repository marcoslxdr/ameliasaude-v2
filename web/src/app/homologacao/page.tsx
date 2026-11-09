import type { Metadata } from 'next';
import { HomologationWorkspace } from '@/components/sales/HomologationWorkspace';
import './homologacao.css';

export const metadata: Metadata = {
  title: 'Homologação da jornada comercial',
  description: 'Modelo de avaliação da jornada comercial da Amélia Saúde.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: '/homologacao' },
};
export default function HomologacaoPage() { return <HomologationWorkspace />; }
