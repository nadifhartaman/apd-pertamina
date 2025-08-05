"use client"
export default function InputField({ children, size, type, placeholder, onChange }) {
  const sizeButton = {
    sm: "input-sm",
    md: "input-md",
    lg: "input-lg"
  }
  return (
    <div>
      <input type={type} placeholder={placeholder} className={`input input-bordered w-full max-w-xs` + sizeButton[size]} onChange={onChange}>{children}</input>
    </div>
  );
}