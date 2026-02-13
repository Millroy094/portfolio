import { defineAuth } from "@aws-amplify/backend-auth";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["admin"],
  multifactor: {
    mode: "REQUIRED",
    totp: true,
    sms: true,
  },
});
