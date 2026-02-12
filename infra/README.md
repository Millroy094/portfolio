<!-- BEGIN_TF_DOCS -->

## Requirements

| Name                                                                     | Version   |
| ------------------------------------------------------------------------ | --------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.14.0 |
| <a name="requirement_aws"></a> [aws](#requirement_aws)                   | ~> 6.31   |

## Providers

| Name                                             | Version |
| ------------------------------------------------ | ------- |
| <a name="provider_aws"></a> [aws](#provider_aws) | ~> 6.31 |

## Modules

No modules.

## Resources

| Name                                                                                                                                                           | Type     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [aws_amplify_app.portfolio](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/amplify_app)                                           | resource |
| [aws_amplify_branch.deployment_branch](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/amplify_branch)                             | resource |
| [aws_amplify_domain_association.portfolio_domain](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/amplify_domain_association)      | resource |
| [aws_iam_policy.amplify_service_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy)                           | resource |
| [aws_iam_role.amplify_service_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role)                                      | resource |
| [aws_iam_role_policy_attachment.attach_amplify_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |

## Inputs

| Name                                                                  | Description     | Type     | Default | Required |
| --------------------------------------------------------------------- | --------------- | -------- | ------- | :------: |
| <a name="input_domain"></a> [domain](#input_domain)                   | n/a             | `string` | n/a     |   yes    |
| <a name="input_gh_owner"></a> [gh_owner](#input_gh_owner)             | GitHub org/user | `string` | n/a     |   yes    |
| <a name="input_gh_repo"></a> [gh_repo](#input_gh_repo)                | Repository name | `string` | n/a     |   yes    |
| <a name="input_github_token"></a> [github_token](#input_github_token) | n/a             | `string` | n/a     |   yes    |

## Outputs

| Name                                                                             | Description                             |
| -------------------------------------------------------------------------------- | --------------------------------------- |
| <a name="output_amplify_app_id"></a> [amplify_app_id](#output_amplify_app_id)    | n/a                                     |
| <a name="output_amplify_app_url"></a> [amplify_app_url](#output_amplify_app_url) | Public URL for the deployed Amplify app |

<!-- END_TF_DOCS -->
