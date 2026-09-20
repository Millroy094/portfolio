terraform {
  required_version = ">= 1.14.0"
  cloud {
    organization = "millroyfernandes"

    workspaces {
      name = "portfolio"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.31"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      Author      = var.author
      ManagedBy   = var.managed_by
    }
  }
}