import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { useState } from "react";

export function Selector({
  options,
  onSelect,
  placeholder = "Válassz másik terméket",
}: {
  options?: {
    code: string;
    label: string;
  }[];
  onSelect?: (value: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const onValueChange = (value: string) => {
    setValue(value);
    onSelect && onSelect(value);
  };

  const isDisabled = !options;
  return (
    <>
      <div className="space-y-6">
        <SearchSelect
          disabled={isDisabled}
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          className={isDisabled ? "opacity-30" : ""}
        >
          {!isDisabled &&
            options.map((item) => (
              <SearchSelectItem
                key={item.code}
                value={item.code}
                className="cursor-pointer"
              >
                {item.label}
              </SearchSelectItem>
            ))}
        </SearchSelect>
      </div>
    </>
  );
}
