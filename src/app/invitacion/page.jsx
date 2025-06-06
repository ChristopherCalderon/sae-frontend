import InvitationCard from '@/components/cards/InvitationCard'
import React, { Suspense } from 'react'

function Invitacion() {
  return (
    <Suspense fallback={<div className="p-10">Cargando...</div>}>
    <InvitationCard/>
  </Suspense>
  )
}

export default Invitacion