import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Profile: a
    .model({
      fullName: a.string().required(),
      punchLine: a.string(),
      avatarKey: a.string(),
      linkedIn: a.string(),
      github: a.string(),
      stackOverflow: a.string(),
      resume: a.string(),
      aboutMe: a.string(),
      skills: a.string().array(),
      roles: a.hasMany("Role", "profileId"),
      badges: a.hasMany("Badge", "profileId"),
      experiences: a.hasMany("Experience", "profileId"),
      education: a.hasMany("Education", "profileId"),
      projects: a.hasMany("Project", "profileId"),
      seoTitle: a.string().required(),
      seoDescription: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"]),
    ]),
  Role: a
    .model({
      value: a.string().required(),
      profileId: a.id().required(),
      profile: a.belongsTo("Profile", "profileId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"]),
    ]),

  Badge: a
    .model({
      value: a.string().required(),
      label: a.string().required(),
      profileId: a.id().required(),
      profile: a.belongsTo("Profile", "profileId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"]),
    ]),

  Experience: a
    .model({
      organization: a.string().required(),
      title: a.string().required(),
      year: a.integer().required(),
      profileId: a.id().required(),
      profile: a.belongsTo("Profile", "profileId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"]),
    ]),

  Education: a
    .model({
      institute: a.string().required(),
      qualification: a.string().required(),
      year: a.integer().required(),
      profileId: a.id().required(),
      profile: a.belongsTo("Profile", "profileId"),
    })

    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"]),
    ]),
  Project: a
    .model({
      name: a.string().required(),
      description: a.string(),
      url: a.string(),
      profileId: a.id().required(),
      profile: a.belongsTo("Profile", "profileId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
