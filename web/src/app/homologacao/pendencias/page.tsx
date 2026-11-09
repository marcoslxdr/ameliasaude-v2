import type { Metadata } from 'next';
import { PendingForm } from './pending-form';
import './pending-form.css';

export const metadata: Metadata = {
  title: 'Respostas às pendências | Amélia Saúde',
  robots: { index: false, follow: false },
};
export default function PendingPage() { return <PendingForm />; }
