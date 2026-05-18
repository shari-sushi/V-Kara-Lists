# -------------------------------------------------------------------
# IAM Managed Policy: S3 env ファイルへの読み取り権限
# -------------------------------------------------------------------
resource "aws_iam_policy" "policy_get_s3" {
  name = "policy_get_s3"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = [
          "${aws_s3_bucket.api_env.arn}/.env",
          "${aws_s3_bucket.app_env.arn}/.env",
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject"]
        Resource = "${aws_s3_bucket.db_backup.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = "${aws_s3_bucket.db_backup.arn}"
      }
    ]
  })
}

# -------------------------------------------------------------------
# IAM Role: EC2 が S3 env ファイルを取得するためのロール
# -------------------------------------------------------------------
resource "aws_iam_role" "ec2" {
  name        = "role_ec2_get_s3"
  description = "Allows EC2 instances to call AWS services on your behalf."

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ec2.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_s3" {
  role       = aws_iam_role.ec2.name
  policy_arn = aws_iam_policy.policy_get_s3.arn
}

resource "aws_iam_role_policy_attachment" "ec2_ecr" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "role_ec2_get_s3"
  role = aws_iam_role.ec2.name
}

# -------------------------------------------------------------------
# EC2 Instance
# -------------------------------------------------------------------
resource "aws_instance" "app" {
  ami                         = "ami-054400ced365b82a0"
  instance_type               = "t3a.micro"
  subnet_id                   = aws_subnet.public_a.id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  key_name                    = "key-for-vkara-instance"
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    # SSM Agent（デプロイに SSH 不要・Port 22 を閉じるために必要）
    snap install amazon-ssm-agent --classic
    systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
    systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service

    # セキュリティパッチ自動適用（Ubuntu 向け）
    apt-get install -y unattended-upgrades
    dpkg-reconfigure -f noninteractive unattended-upgrades
  EOF

  lifecycle {
    ignore_changes = [user_data]
  }

  tags = { Name = "v-kara-public" }
}
