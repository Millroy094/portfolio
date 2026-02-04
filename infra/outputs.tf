output "amplify_app_url" {
  value       = format("https://%s.%s.amplifyapp.com", aws_amplify_branch.deployment_branch.branch_name, aws_amplify_app.portfolio.id)
  description = "Public URL for the deployed Amplify app"
}