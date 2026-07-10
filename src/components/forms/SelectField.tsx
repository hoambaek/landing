/** 언더라인 셀렉트 필드 — UnderlineField와 같은 결에 쉐브론만 얹는다. 미선택 시 placeholder 톤 */
export default function SelectField({
  label,
  placeholder,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="s-field">
      <label className="s-field__label" htmlFor={name}>
        {label}
      </label>
      <div className="s-select">
        <select
          id={name}
          name={name}
          className={`s-field__input s-select__input${value ? "" : " is-empty"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="s-select__chevron"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M2.5 4.25L6 7.75L9.5 4.25"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="s-field__rule" />
    </div>
  );
}
