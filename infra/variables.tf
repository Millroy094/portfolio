variable "github_token" {
  description = "GitHub repo token"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "domain name example portfolio.com"
  type        = string
}

variable "g_tag" {
  description = "Google tag id for analytics"
  type        = string
}

variable "gh_owner" {
  description = "GitHub org/user"
  type        = string
}

variable "gh_repo" {
  description = "Repository name"
  type        = string
}

variable "oidc_issuer_url" {
  description = "Issuer URL of the external OIDC provider used for admin sign-in"
  type        = string
}

variable "oidc_provider_name" {
  description = "Name of the OIDC provider as configured in amplify/auth/resource.ts"
  type        = string
  default     = "Auth"
}

variable "oidc_client_id" {
  description = "Client ID of the external OIDC provider used for admin sign-in"
  type        = string
  sensitive   = true
}

variable "oidc_client_secret" {
  description = "Client secret of the external OIDC provider used for admin sign-in"
  type        = string
  sensitive   = true
}
