# -------------------------------------------------------------------
# ALB Security Group (sg-01ec8fe8a9d0d7e1e)
# name: v-kara-app-security-group02
# ingress: 80, 443, 3000 from 0.0.0.0/0
# -------------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "v-kara-app-security-group02"
  description = "public"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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

# -------------------------------------------------------------------
# EC2 Security Group (sg-0f1e03844c853a15d)
# name: v-kara-ec2-instance
# ingress: all from 0.0.0.0/0, 22 from var.allowed_ssh_cidr_ec2, 443 from 0.0.0.0/0
# egress: all to 0.0.0.0/0, 3306 to RDS SG
# -------------------------------------------------------------------
resource "aws_security_group" "ec2" {
  name        = "v-kara-ec2-instance"
  description = "sg for an instance of fronrend and backend without db"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "2025 alone live with lenovo"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr_ec2]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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

# -------------------------------------------------------------------
# RDS Security Group (sg-01387505ed9b33a35)
# name: v-kara-rds-sg
# ingress: 22 from var.allowed_ssh_cidr_rds, 3306 from subnet CIDRs (2 rules)
# egress: all to 0.0.0.0/0, all to sg-0429fb016ec21fcbd, all to sg-0e1b0dc5a5f38561b
# -------------------------------------------------------------------
resource "aws_security_group" "rds" {
  name        = "v-kara-rds-sg"
  description = "Created by RDS management console"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr_rds]
  }

  ingress {
    description = "ecs_subnert_cidr"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.1.0.0/26", "10.1.0.64/26"]
  }

  ingress {
    description = "ec2_private_ip4"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.1.0.49/32"]
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
