'use client';

export const InputTable = ({ type = 'text', style, value, onChange, width }) => {

  const allowedTypes = ['text', 'number'];
  const inputType = allowedTypes.includes(type) ? type : 'text';

  const sizeInput = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-md',
    extra: 'text-lg',
  }

  
  const widthInput = {
    full: 'w-full',
    small: 'w-12',
    ds: 'w-24 md:w-fit',
  }

  return (
    <input className={`border-0 ring-0 focus:border-transparent focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  h-[30px] text-center validator ${sizeInput[style]} ${widthInput[width]}`} type={inputType} value={value} onChange={onChange} />
  )
}