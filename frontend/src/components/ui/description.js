export const Description = ({style, children}) => {

  const stylePosition = {
    x5: 'mx-5 my-2',
    x8: 'mx-8 my-2',
    x10: 'mx-10 my-2',
  }
  return (
    <div className={`${stylePosition[style]} text-sm px-3 py-2 rounded-md border bg-base-200 border-base-300`}>{children}</div>
  )
}