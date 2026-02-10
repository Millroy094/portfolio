import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "@/amplify/storage/resource";
import { data } from "@/amplify/data/resource";

defineBackend({ auth, storage, data });
