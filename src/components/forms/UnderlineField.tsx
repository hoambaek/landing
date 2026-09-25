/** 언더라인 입력 필드 — 화면 언어 라벨 + 박스 없는 인풋 + 헤어라인(포커스 시 2px 금갈색) + 오류 한 줄 */
export default function UnderlineField({
  label,
  placeholder,
  name,
  type = "text",
  multiline = false,
  required = false,
  error,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  /** 필드 아래 한 줄로 보이는 오류 문구 — 있으면 라벨·밑줄도 오류색 */
  error?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const errorId = `${name}-error`;
  return (
    <div className={`s-field${error ? " is-invalid" : ""}`}>
      <label className="s-field__label" htmlFor={name}>
        {label}
      </label>
      <div className="s-field__control">
        {multiline ? (
          <textarea
            id={name}
            name={name}
            className="s-field__input"
            placeholder={placeholder}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
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
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <span className="s-field__rule" />
      </div>
      {error && (
        <p className="s-field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
