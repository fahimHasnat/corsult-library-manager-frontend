import forms from "@tailwindcss/forms";

const tailwindConfig = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [forms],
};

export default tailwindConfig;
