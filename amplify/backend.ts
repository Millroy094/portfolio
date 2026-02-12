import { defineBackend } from "@aws-amplify/backend";

import { data } from "@/amplify/data/resource";
import { storage } from "@/amplify/storage/resource";

import { auth } from "./auth/resource";

defineBackend({ auth, storage, data });
