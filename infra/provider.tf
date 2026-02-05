terraform {
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
  region = "eu-west-2"

  default_tags {
    tags = {
      Application = "portfolio"
    }
  }
}