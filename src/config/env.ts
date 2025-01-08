// env function to check if required environment variables are available or not
export const env = () => {
  const requiredVariables = ["MONGODB_URI", "JWT_SECRET"]; // list of required variables

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
  ); // filtering out non-available variables

  if (missingVariables.length > 0) {
    // throwing error if there are any missing variable
    throw new Error(
      `Missing Required Environment variables : ${missingVariables.join(", ")}`
    );
  }

  return {
    MONGODB_URI: getValue("MONGODB_URI"),
    JWT_SECRET: getValue("JWT_SECRET"),
  }; // returing object of variable's
};

// function to get value of environment variable using key
const getValue = (key: string): string => {
  return process.env[key] as string;
};
