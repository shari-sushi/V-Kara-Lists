import { DeleteIcon } from "@/icons/DeleteIcon"

type RemoveRowButtonProps = {
  RemoveRow: () => void
  disabled?: boolean
}

export const RemoveRowButton = ({ RemoveRow, disabled }: RemoveRowButtonProps) => {
  const handleClick = () => {
    if (disabled) return
    RemoveRow()
  }

  return (
    <div className="select-none w-full flex justify-center">
      <div className={`w-10 flex justify-center rounded-md  bg-zinc-300/70 ${disabled ? "opacity-70 text-black/30" : "cursor-pointer hover:bg-zinc-400"}`} onClick={handleClick}>
        <DeleteIcon height={32} width={32} className="fill-zinc-700" />
      </div>
    </div>
  )
}
