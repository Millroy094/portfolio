resource "aws_amplify_app" "portfolio" {
  name                 = "portfolio"
  repository           = "https://github.com/${var.gh_owner}/${var.gh_repo}"
  access_token         = var.github_token
  build_spec           = file("${path.module}/amplify.yml")
  platform             = "WEB_COMPUTE"
  iam_service_role_arn = aws_iam_role.amplify_service_role.arn
  environment_variables = {
    PUBLIC_URL = "https://www.${var.domain}"
  }
}

resource "aws_amplify_branch" "deployment_branch" {
  app_id            = aws_amplify_app.portfolio.id
  branch_name       = "main"
  stage             = "PRODUCTION"
  enable_auto_build = false
  framework         = "Next.js - SSR"
}


resource "aws_amplify_domain_association" "portfolio_domain" {
  app_id      = aws_amplify_app.portfolio.id
  domain_name = var.domain

  sub_domain {
    branch_name = aws_amplify_branch.deployment_branch.branch_name
    prefix      = "www"
  }
}
