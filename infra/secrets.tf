# Amplify Gen2 resolves `secret()` in amplify/auth/resource.ts from SSM
# parameters at this fixed path - see:
# https://docs.amplify.aws/nextjs/deploy-and-host/sandbox-environments/features/#secure-secrets-in-your-sandbox
resource "aws_ssm_parameter" "oidc_client_id" {
  name  = "/amplify/shared/${aws_amplify_app.portfolio.id}/OIDC_CLIENT_ID"
  type  = "SecureString"
  value = var.oidc_client_id
}

resource "aws_ssm_parameter" "oidc_client_secret" {
  name  = "/amplify/shared/${aws_amplify_app.portfolio.id}/OIDC_CLIENT_SECRET"
  type  = "SecureString"
  value = var.oidc_client_secret
}
