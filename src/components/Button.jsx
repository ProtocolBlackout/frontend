import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant,
  ...rest
}) => {
  const variantClass = variant ? styles[`retroBtn--${variant}`] || "" : "";
  const buttonClass = [styles.retroBtn, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
