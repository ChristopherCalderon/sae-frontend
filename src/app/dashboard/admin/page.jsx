import React from 'react'
import ManagementTable from '@/components/tables/ManagementTable';

function AdminPage() {
  return (
    <div className='bg-background flex flex-col gap-5 w-full h-full p-8 '>
      <div className='w-full text-primary '>
        <h1 className='text-2xl font-mono font-bold'>Administrar secciones</h1>
        <p className='font-mono'>Asigna modelos de IA por secciones</p>
      </div>

      <div className='w-full h-11/12 bg-white shadow-xl'>
    <ManagementTable />
      </div>
    </div>
  )
}

export default AdminPage