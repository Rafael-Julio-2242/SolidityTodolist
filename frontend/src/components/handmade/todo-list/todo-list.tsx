'use client';

import { RippleButton } from "@/components/animate-ui/buttons/ripple";

export default function TodoList({ account } : { account: string | null }) {

  const handleAddTodo = async () => {
    console.log('Adicionar');
  }

  return (
    <div className='flex flex-col items-center gap-4 border-2 border-gray-400 min-w-[500px] min-h-[500px] relative'>
        <RippleButton className='self-end m-8' onClick={handleAddTodo}>Adicionar</RippleButton>
    </div>
  )

}
