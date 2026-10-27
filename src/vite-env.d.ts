declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Если используете CSS модули (.module.css)
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}