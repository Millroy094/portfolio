resource "aws_amplify_app" "portfolio" {
  name         = "portfolio"
  repository   = "https://github.com/Millroy094/portfolio"
  access_token = var.github_token
  build_spec   = file("${path.module}/amplify.yml")
  platform     = "WEB_COMPUTE"
}

resource "aws_amplify_branch" "deployment_branch" {
  app_id            = aws_amplify_app.portfolio.id
  branch_name       = "main"
  stage             = "PRODUCTION"
  enable_auto_build = true
  framework         = "Next.js - SSR"
}