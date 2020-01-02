export const validators = {
  password: {
    presence: {
      message: "is a required field",
    },
    length: {
      minimum: 6,
      message: "must be at least 6 characters",
    },
  },
  email: {
    presence: {
      message: "is required",
    },
    email: {
      message: "doesn't look valid",
    },
  },
};
