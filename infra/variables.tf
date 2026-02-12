variable "github_token" {
  description = "GitHub repo token"
  type      = string
  sensitive = true
}

variable "domain" {
  description = "domain name example portfolio.com"
  type = string
}

variable "g_tag" {
  description = "Google tag id for analytics"
  type = string
}

variable "gh_owner" {
  description = "GitHub org/user"
  type        = string
}

variable "gh_repo" {
  description = "Repository name"
  type        = string
}
