/** 언더라인 입력 필드 — mono 라벨 + 박스 없는 인풋 + 헤어라인(포커스 시 앰버) */
export default function UnderlineField({
  label,
  placeholder,
  name,
  type = "text",
  multiline = false,
  required = false,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="s-field">
      <label className="s-field__label" htmlFor={name}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          className="s-field__input"
          placeholder={placeholder}
          required={required}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className="s-field__input"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <span className="s-field__rule" />
    </div>
  );
}
