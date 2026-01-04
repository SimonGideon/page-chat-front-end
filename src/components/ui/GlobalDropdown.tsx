/* eslint-disable no-unsafe-finally */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/GlobalDropdown.tsx
import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

// Types
export interface DropdownOption {
  text: string;
  value: string;
}

interface GlobalDropdownProps {
  options: DropdownOption[];
  label?: string;
  name: string;
  value?: string | string[];
  onChange: (
    value: string | string[],
    option?: DropdownOption | DropdownOption[]
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  searchable?: boolean;
  multiple?: boolean;
  isLoading?: boolean;
  /**
   * For multi-select: initial list of items to be marked as selected. Can be an array of strings (values) or array of objects.
   */
  initialList?: string[] | Record<string, unknown>[];
  /**
   * For multi-select: key to extract from initialList to match dropdown option values
   */
  initialKey?: string;
}

const GlobalDropdown: React.FC<GlobalDropdownProps> = ({
  options = [],
  label,
  name,
  value = "",
  onChange,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className = "",
  error,
  searchable = false,
  multiple = false,
  isLoading = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    typeof value === "string" ? value : ""
  );
  const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option object (match by value first, then by text as fallback, case-insensitive)
  const selectedOptionObj =
    options.find((opt: DropdownOption) => opt?.value === selectedOption) ||
    options.find(
      (opt: DropdownOption) =>
        opt?.text?.toLowerCase() === selectedOption?.toLowerCase()
    );

  // Filter options based on search term
  const filteredOptions =
    searchTerm.trim() === ""
      ? options
      : options.filter((option: DropdownOption) =>
          option?.text?.toLowerCase()?.includes(searchTerm.toLowerCase())
        );

  // Update local state when value prop changes
  useEffect(() => {
    const incoming = typeof value === "string" ? value : "";

    // Find option by value first, then by text (case-insensitive)
    const optionByValue = options.find((opt) => opt?.value === incoming);
    const optionByText = options.find(
      (opt) => opt?.text?.toLowerCase() === incoming?.toLowerCase()
    );

    // Use the option's value (normalized) if found by either value or text
    if (optionByValue) {
      setSelectedOption(optionByValue.value);
    } else if (optionByText) {
      setSelectedOption(optionByText.value);
    } else {
      setSelectedOption(incoming);
    }

    if (multiple) {
      if (Array.isArray(value)) {
        // For multi-select, match by both value and text (case-insensitive)
        const matchedOptions = options.filter((opt: DropdownOption) =>
          (value as string[]).some(
            (v) =>
              v === opt?.value || v?.toLowerCase() === opt?.text?.toLowerCase()
          )
        );
        setSelectedOptions(matchedOptions);
      } else if (value) {
        const matchedOption = optionByValue || optionByText;
        setSelectedOptions(matchedOption ? [matchedOption] : []);
      } else {
        setSelectedOptions([]);
      }
    }
  }, [value, options, multiple]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const option = options.find(
        (opt: DropdownOption) => opt.value === optionValue
      );
      if (!option) return;
      let updated;
      if (selectedOptions.some((opt) => opt.value === optionValue)) {
        // Deselect
        updated = selectedOptions.filter((opt) => opt.value !== optionValue);
      } else {
        // Select
        updated = [...selectedOptions, option];
      }
      setSelectedOptions(updated);
      onChange(
        updated.map((opt: DropdownOption) => opt.value),
        updated
      );
      setSearchTerm("");
    } else {
      setSelectedOption(optionValue);
      const selectedOption = options.find(
        (opt: DropdownOption) => opt.value === optionValue
      );
      onChange(optionValue, selectedOption);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (multiple) {
      // For native <select multiple> (non-searchable mode)
      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
      const selectedOpts = options.filter((opt: DropdownOption) =>
        selected.includes(opt.value)
      );
      setSelectedOptions(selectedOpts);
      onChange(selected, selectedOpts);
    } else {
      setSelectedOption(newValue);
      const selectedOption = options.find(
        (opt: DropdownOption) => opt.value === newValue
      );
      onChange(newValue, selectedOption);
    }
  };

  // Note: multiple selection via native select only (react-select not used)

  if (!searchable) {
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="mt-1 relative">
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id={name}
            name={name}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={
              multiple ? selectedOptions.map((o) => o.value) : selectedOption
            }
            onChange={handleSelectChange}
            disabled={disabled || isLoading}
            required={required}
            multiple={multiple}
          >
            {!multiple && <option value="">{placeholder}</option>}
            {options.map((option: DropdownOption) => (
              <option key={option.value} value={option.value}>
                {name === "postalCode"
                  ? `${option.value} - ${option.text}`
                  : option.text}
              </option>
            ))}
          </select>
          {multiple && selectedOptions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center text-xs"
                >
                  {opt.text}
                  <button
                    type="button"
                    className="ml-1 text-blue-700 hover:text-red-500"
                    onClick={() => handleOptionSelect(opt.value)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-sm text-gray-500 mt-1">Loading options...</div>
        )}
        {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div className={className} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="mt-1 relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            appearance-none cursor-pointer flex items-center justify-between 
            w-full px-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } 
            rounded-[8px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 
            sm:text-sm ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        >
          <div className="truncate flex flex-wrap gap-1">
            {multiple && selectedOptions.length > 0
              ? selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center text-xs mr-1"
                  >
                    {opt.text}
                    <button
                      type="button"
                      className="ml-1 text-blue-700 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionSelect(opt.value);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              : !multiple && selectedOptionObj
              ? name === "postalCode"
                ? `${selectedOptionObj.value} - ${selectedOptionObj.text}`
                : selectedOptionObj.text
              : placeholder}
          </div>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>

        {isOpen && !disabled && (
          <div
            className="absolute z-50 w-full bg-white shadow-lg rounded-md border border-gray-200 mt-1"
            style={{ minWidth: "100%" }}
          >
            {/* Search input */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-[8px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                {searchTerm && (
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchTerm("");
                    }}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option: DropdownOption) => (
                  <div
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      px-3 py-2 cursor-pointer hover:bg-gray-100
                      ${
                        multiple &&
                        selectedOptions.some(
                          (opt) => opt.value === option.value
                        )
                          ? "bg-blue-50 text-blue-700"
                          : !multiple && option.value === selectedOption
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-900"
                      }
                    `}
                  >
                    {name === "postalCode"
                      ? `${option.value} - ${option.text}`
                      : option.text}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {isLoading && !isOpen && (
        <div className="text-sm text-gray-500 mt-1">Loading options...</div>
      )}
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}

      {/* Hidden input for form submission */}
      {!multiple && <input type="hidden" name={name} value={selectedOption} />}
      {multiple && (
        <>
          {selectedOptions.map((opt) => (
            <input
              key={opt.value}
              type="hidden"
              name={name}
              value={opt.value}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default GlobalDropdown;
