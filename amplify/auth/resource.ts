import { defineAuth } from "@aws-amplify/backend-auth";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  multifactor: {
    mode: "REQUIRED",
    totp: true,
    sms: false,
  },
});
