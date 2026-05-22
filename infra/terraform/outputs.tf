output "ec2_public_ip" {
  description = "EC2 のパブリック IP"
  value       = aws_instance.app.public_ip
}

# output "rds_endpoint" {
#   description = "RDS エンドポイント"
#   value       = aws_db_instance.main.endpoint
#   sensitive   = true
# }
