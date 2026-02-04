variable "github_token" {
  type      = string
  sensitive = true
}

variable "domain" {
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
