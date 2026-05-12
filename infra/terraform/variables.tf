variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

# SSH アクセスを許可する CIDR（自宅 IP 等）
# terraform.tfvars で設定する（gitignore 済み）
variable "allowed_ssh_cidr_ec2" {
  description = "CIDR allowed to SSH into EC2"
  type        = string
}

variable "allowed_ssh_cidr_rds" {
  description = "CIDR allowed to SSH into RDS bastion"
  type        = string
}

# RDS KMS key ID（アカウント ID を含むため変数化）
variable "rds_kms_key_id" {
  description = "KMS key ARN for RDS storage encryption"
  type        = string
}
