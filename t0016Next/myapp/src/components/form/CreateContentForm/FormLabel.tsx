import { DisableBox, NeedBox } from "@/components/box/Box"
import { FormTW } from "@/styles/tailwiind"

type FormLabelProps = {
  label: string
  need?: boolean
  autoForm?: boolean
  bodyNote?: React.ReactNode
}

export const FormLabel = ({ label, bodyNote, need, autoForm }: FormLabelProps) => {
  return (
    <div className={`${FormTW.label}`}>
      {label}
      <div className="inline-flex">{bodyNote}</div>
      {need && <NeedBox />}
      {autoForm && <DisableBox />}
    </div>
  )
}
