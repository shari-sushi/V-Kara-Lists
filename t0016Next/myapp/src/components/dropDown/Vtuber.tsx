import React from "react"
import Select from "react-select"
import type { ReceivedVtuber } from "@/types/vtuber_content"
import { DropStyle } from "./common"

type vtuberListsProps = {
  value: number
  label: string
}

type DropDownVtuberProps = {
  vtubers: ReceivedVtuber[]
  onSelectVtuber: (vtuberId: number) => void
  defaultMenuIsOpen: boolean
}

export const DropDownVtuber = ({ vtubers, onSelectVtuber, defaultMenuIsOpen }: DropDownVtuberProps) => {
  const vtuberOptions = makeVtuberOptions(vtubers)

  const onChange = (option: vtuberListsProps | null) => {
    if (option == null) {
      onSelectVtuber(0)
    } else {
      onSelectVtuber(option.value)
    }
  }

  return (
    <Select
      id="selectbox"
      instanceId="selectbox"
      placeholder="VTuberを検索/選択"
      className="basic-single"
      classNamePrefix="select"
      isClearable
      isSearchable
      name="VTuber"
      options={vtuberOptions}
      defaultMenuIsOpen={defaultMenuIsOpen}
      blurInputOnSelect
      styles={DropStyle}
      onChange={onChange}
    />
  )
}

const makeVtuberOptions = (vtubers: ReceivedVtuber[]): vtuberListsProps[] => {
  if (vtubers.length == 0) {
    return []
  }

  return vtubers.map((vtuber: ReceivedVtuber) => makeVtuberOption(vtuber))
}

const makeVtuberOption = (vtuber: ReceivedVtuber): vtuberListsProps => {
  return {
    value: vtuber.VtuberId,
    label: vtuber.VtuberName,
  }
}
