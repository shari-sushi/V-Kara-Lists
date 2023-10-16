import { useForm, } from "react-hook-form";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/router";
import Link from 'next/link';
import type { SingData } from '../types/singdata';

function Dropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickToCloseDropdown = (event: any) => {
      const element = dropdownListRef.current;
      if (!showDropdown || element?.contains(event.target)) return;
      setShowDropdown(false);
    };

    window.addEventListener("click", handleClickToCloseDropdown);
    return () => {
      window.removeEventListener("click", handleClickToCloseDropdown);
    };
  }, [showDropdown, dropdownListRef]);

  return (
    <div className="DropdownContainer">
      <button
        type="button"
        onClick={() => {
          setShowDropdown((prevState) => !prevState);
        }}
      >
        Toggle dropdown
      </button>

      {showDropdown && (
        <ul ref={dropdownListRef} className="DropdownList">
          <li className="Item">
            <button onClick={() => console.log("item 1 clicked!")}>
              item 1
            </button>
          </li>
          <li className="Item">
            <button onClick={() => console.log("item 2 clicked!")}>
              item 2
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}