import FeedbackCard from '@/components/cards/FeedbackCard';
import { Suspense } from 'react';

export default function Feedback() {
  return (
    <Suspense fallback={<div className="p-10">Cargando...</div>}>
      <FeedbackCard />
    </Suspense>
  );
}