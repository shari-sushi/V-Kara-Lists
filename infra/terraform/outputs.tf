output "alb_dns_name" {
  description = "ALB の DNS 名（Cloudflare CNAME に設定する値）"
  value       = aws_lb.main.dns_name
}

output "ec2_public_ip" {
  description = "EC2 のパブリック IP"
  value       = aws_instance.app.public_ip
}

output "rds_endpoint" {
  description = "RDS エンドポイント"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}
