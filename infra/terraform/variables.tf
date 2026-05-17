variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

# SSH アクセスを許可する CIDR（自宅 IP 等）
# terraform.tfvars で設定する（gitignore 済み）
variable "allowed_ssh_cidr_ec2" {
  description = "CIDR allowed to SSH into EC2"
  type        = string
}

# variable "allowed_ssh_cidr_rds" {
#   description = "CIDR allowed to SSH into RDS bastion"
#   type        = string
# }

# # RDS KMS key ID（アカウント ID を含むため変数化）
# variable "rds_kms_key_id" {
#   description = "KMS key ARN for RDS storage encryption"
#   type        = string
# }

# # RDS マスターユーザー名（terraform.tfvars で設定する）
# variable "db_username" {
#   description = "RDS master username"
#   type        = string
#   sensitive   = true
# }

# # RDS マスターパスワード（terraform.tfvars で設定する）
# # 既存 RDS を import した場合は ignore_changes により Terraform の管理外となるため、
# # 実際のパスワード変更は AWS コンソールまたは CLI で行うこと
# variable "db_password" {
#   description = "RDS master password (used only on initial creation; ignored after import via lifecycle.ignore_changes)"
#   type        = string
#   sensitive   = true
# }
