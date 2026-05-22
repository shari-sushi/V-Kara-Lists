# -------------------------------------------------------------------
# EC2 Security Group
# name: v-kara-ec2-instance
# ingress: 22 from var.allowed_ssh_cidr_ec2, 80/443 from internet (Cloudflare proxy)
# egress: all to 0.0.0.0/0
# Note: 8080 は外部非公開。Caddy が内部でルーティングする
# -------------------------------------------------------------------
resource "aws_security_group" "ec2" {
  name        = "v-kara-ec2-instance"
  description = "sg for an instance of fronrend and backend without db"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP from internet (Cloudflare proxy)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from internet (Caddy TLS)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH from home"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr_ec2]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    ignore_changes = [ingress, egress]
  }
}

# # -------------------------------------------------------------------
# # RDS Security Group
# # name: v-kara-rds-sg
# # ingress: 3306 from EC2 SG, 22 from var.allowed_ssh_cidr_rds
# # egress: all to 0.0.0.0/0
# #
# # TODO: このSGは現在 RDS と踏み台EC2 (ec2-for-rds) の両方にアタッチされており、
# #       SSH(22) と 3306 が同一SG内に混在している。
# #       bastion用SGを分割して責務を明確にする。 → # 337
# # -------------------------------------------------------------------
# resource "aws_security_group" "rds" {
#   name        = "v-kara-rds-sg"
#   description = "Created by RDS management console"
#   vpc_id      = aws_vpc.main.id

#   ingress {
#     description = "SSH from home"
#     from_port   = 22
#     to_port     = 22
#     protocol    = "tcp"
#     cidr_blocks = [var.allowed_ssh_cidr_rds]
#   }

#   ingress {
#     description     = "MySQL from EC2"
#     from_port       = 3306
#     to_port         = 3306
#     protocol        = "tcp"
#     security_groups = [aws_security_group.ec2.id]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   lifecycle {
#     ignore_changes = [ingress, egress]
#   }
# }
